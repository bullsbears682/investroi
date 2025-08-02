from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from datetime import datetime
from app.database import get_db, ROICalculation
from app.schemas.roi import PDFExportRequest
from app.services.pdf_generator import PDFGenerator
from app.cache import CacheManager

router = APIRouter(prefix="/api/pdf", tags=["PDF Export"])
cache = CacheManager()
pdf_generator = PDFGenerator()

@router.post("/export")
async def export_pdf(
    request: PDFExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Generate and export a PDF report"""
    
    try:
        # Get calculation data
        calculation = db.query(ROICalculation).filter(
            ROICalculation.session_id == request.session_id
        ).first()
        
        if not calculation:
            raise HTTPException(status_code=404, detail="Calculation not found")
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"roi_report_{timestamp}_{uuid.uuid4().hex[:8]}.pdf"
        filepath = os.path.join("temp", filename)
        
        # Ensure temp directory exists
        os.makedirs("temp", exist_ok=True)
        
        # Generate PDF in background
        background_tasks.add_task(
            pdf_generator.generate_report,
            calculation_data=calculation,
            export_options=request.dict(),
            output_path=filepath
        )
        
        return {
            "message": "PDF generation started",
            "filename": filename,
            "download_url": f"/api/pdf/download/{filename}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/download/{filename}")
async def download_pdf(filename: str):
    """Download generated PDF file"""
    
    filepath = os.path.join("temp", filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type="application/pdf"
    )

@router.get("/templates")
async def get_pdf_templates():
    """Get available PDF templates"""
    
    templates = [
        {
            "id": "standard",
            "name": "Standard Report",
            "description": "Comprehensive analysis with charts and detailed recommendations",
            "pages": "5-8",
            "file_size": "~800KB",
            "features": [
                "Executive summary",
                "ROI calculation details",
                "Investment breakdown charts",
                "Risk assessment",
                "Market analysis",
                "Recommendations"
            ]
        },
        {
            "id": "executive",
            "name": "Executive Summary",
            "description": "Condensed summary for executive review and decision-making",
            "pages": "3-5",
            "file_size": "~500KB",
            "features": [
                "Key metrics overview",
                "High-level analysis",
                "Executive recommendations",
                "Risk summary"
            ]
        },
        {
            "id": "detailed",
            "name": "Detailed Analysis",
            "description": "In-depth analysis with market research and risk assessment",
            "pages": "8-12",
            "file_size": "~1.5MB",
            "features": [
                "Comprehensive market analysis",
                "Detailed risk assessment",
                "Competitive analysis",
                "Financial projections",
                "Tax implications",
                "Strategic recommendations"
            ]
        }
    ]
    
    return {"templates": templates}

@router.get("/preview/{session_id}")
async def preview_pdf_report(
    session_id: str,
    template: str = "standard",
    db: Session = Depends(get_db)
):
    """Get a preview of the PDF report content"""
    
    calculation = db.query(ROICalculation).filter(
        ROICalculation.session_id == session_id
    ).first()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
    
    # Generate preview content
    preview = {
        "session_id": session_id,
        "template": template,
        "generated_at": datetime.now().isoformat(),
        "sections": [
            {
                "title": "Executive Summary",
                "content": f"ROI Analysis for {calculation.business_scenario_name}",
                "page": 1
            },
            {
                "title": "Investment Overview",
                "content": f"Initial Investment: ${calculation.initial_investment:,.2f}",
                "page": 2
            },
            {
                "title": "ROI Analysis",
                "content": f"ROI: {calculation.roi_percentage:.2f}%",
                "page": 3
            },
            {
                "title": "Risk Assessment",
                "content": "Risk Score: Medium",
                "page": 4
            },
            {
                "title": "Recommendations",
                "content": "Based on analysis, this investment shows potential...",
                "page": 5
            }
        ],
        "charts": [
            "Investment Breakdown Pie Chart",
            "ROI Timeline Chart",
            "Risk Factors Bar Chart"
        ],
        "estimated_pages": 5 if template == "standard" else 3 if template == "executive" else 8
    }
    
    return preview

@router.delete("/cleanup")
async def cleanup_pdf_files():
    """Clean up old PDF files"""
    
    temp_dir = "temp"
    if not os.path.exists(temp_dir):
        return {"message": "No temp directory found"}
    
    # Remove files older than 24 hours
    current_time = datetime.now()
    removed_count = 0
    
    for filename in os.listdir(temp_dir):
        if filename.endswith(".pdf"):
            filepath = os.path.join(temp_dir, filename)
            file_time = datetime.fromtimestamp(os.path.getctime(filepath))
            
            if (current_time - file_time).total_seconds() > 86400:  # 24 hours
                os.remove(filepath)
                removed_count += 1
    
    return {
        "message": f"Cleaned up {removed_count} old PDF files",
        "removed_count": removed_count
    }

@router.get("/status/{filename}")
async def get_pdf_status(filename: str):
    """Check the status of a PDF generation job"""
    
    filepath = os.path.join("temp", filename)
    
    if os.path.exists(filepath):
        file_size = os.path.getsize(filepath)
        file_time = datetime.fromtimestamp(os.path.getctime(filepath))
        
        return {
            "status": "completed",
            "filename": filename,
            "file_size": file_size,
            "created_at": file_time.isoformat(),
            "download_url": f"/api/pdf/download/{filename}"
        }
    else:
        return {
            "status": "processing",
            "filename": filename,
            "message": "PDF is being generated..."
        }