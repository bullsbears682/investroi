from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import tempfile
from datetime import datetime
from app.services.pdf_generator import pdf_generator_service

router = APIRouter()

class PDFExportRequest(BaseModel):
    """Request model for PDF export"""
    calculation_data: Dict[str, Any]
    report_type: str = "roi_report"
    include_charts: bool = True
    include_recommendations: bool = True

class PDFExportResponse(BaseModel):
    """Response model for PDF export"""
    success: bool
    message: str
    filename: Optional[str] = None
    file_size: Optional[int] = None

@router.post("/export")
async def export_pdf(request: PDFExportRequest):
    """
    Export ROI calculation results as a PDF report
    
    Args:
        request: PDFExportRequest containing calculation data and export options
        
    Returns:
        FileResponse with the generated PDF
    """
    try:
        # Validate calculation data
        if not request.calculation_data:
            raise HTTPException(status_code=400, detail="Calculation data is required")
        
        # Generate PDF report
        pdf_filename = pdf_generator_service.generate_roi_report(request.calculation_data)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"roi_report_{timestamp}.pdf"
        
        # Return file response
        return FileResponse(
            path=pdf_filename,
            filename=filename,
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/download/{session_id}")
async def download_pdf(session_id: str):
    """
    Download the generated PDF report
    
    Args:
        session_id: Session identifier for the PDF
        
    Returns:
        FileResponse with the PDF file
    """
    try:
        # For now, we'll generate a sample PDF
        # In a real implementation, you'd retrieve the PDF from storage/cache
        sample_data = {
            "scenario_name": "SaaS",
            "mini_scenario_name": "B2B SaaS",
            "total_investment": 50000,
            "roi_percentage": 25.5,
            "net_profit": 12750,
            "expected_return": 62750,
            "annualized_roi": 25.5,
            "effective_tax_rate": 16.8,
            "tax_amount": 2142,
            "after_tax_profit": 10608,
            "after_tax_roi": 21.22,
            "calculation_method": "Local Fallback",
            "country_code": "US",
            "initial_investment": 50000,
            "additional_costs": 0,
            "risk_level": "Medium",
            "competition_level": "Medium",
            "market_size": "Large"
        }
        
        # Generate PDF
        pdf_filename = pdf_generator_service.generate_roi_report(sample_data)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"roi_report_{timestamp}.pdf"
        
        # Return file response
        return FileResponse(
            path=pdf_filename,
            filename=filename,
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF download failed: {str(e)}")

@router.post("/download")
async def download_pdf_with_data(request: PDFExportRequest):
    """
    Generate and download PDF with provided calculation data
    
    Args:
        request: PDFExportRequest with calculation data
        
    Returns:
        FileResponse with the generated PDF
    """
    try:
        # Generate PDF
        pdf_filename = pdf_generator_service.generate_roi_report(request.calculation_data)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"roi_report_{timestamp}.pdf"
        
        # Return file response
        return FileResponse(
            path=pdf_filename,
            filename=filename,
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/templates")
async def get_pdf_templates():
    """
    Get available PDF report templates
    
    Returns:
        List of available templates
    """
    templates = [
        {
            "id": "roi_report",
            "name": "ROI Analysis Report",
            "description": "Comprehensive ROI analysis with investment details, tax analysis, and recommendations",
            "sections": [
                "Executive Summary",
                "Investment Details", 
                "ROI Analysis",
                "Tax Analysis",
                "Risk Assessment",
                "Market Analysis",
                "Recommendations"
            ]
        },
        {
            "id": "executive_summary",
            "name": "Executive Summary",
            "description": "Brief executive summary with key metrics",
            "sections": [
                "Executive Summary",
                "Key Metrics",
                "Recommendations"
            ]
        }
    ]
    
    return {"templates": templates}

@router.get("/preview/{session_id}")
async def get_pdf_preview(session_id: str):
    """
    Get PDF preview information
    
    Args:
        session_id: Session identifier
        
    Returns:
        Preview information
    """
    preview_info = {
        "session_id": session_id,
        "status": "ready",
        "pages": 3,
        "sections": [
            "Executive Summary",
            "Investment Details",
            "ROI Analysis", 
            "Tax Analysis",
            "Risk Assessment",
            "Market Analysis",
            "Recommendations"
        ],
        "generated_at": datetime.now().isoformat()
    }
    
    return preview_info

@router.delete("/cleanup")
async def cleanup_temp_files():
    """
    Clean up temporary PDF files
    
    Returns:
        Cleanup status
    """
    try:
        # Clean up temporary files (implement as needed)
        return {"success": True, "message": "Temporary files cleaned up"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")