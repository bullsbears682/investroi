from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
import tempfile
import os
from datetime import datetime

from app.database import get_db
from app.schemas.roi import PDFExportRequest
from app.services.pdf_generator import PDFGenerator

router = APIRouter()

@router.post("/export")
async def export_pdf(
    request: PDFExportRequest,
    db: Session = Depends(get_db)
):
    """Generate PDF report for ROI calculation"""
    
    try:
        # Get calculation data from cache or database
        from app.cache import cache_manager
        calculation_data = cache_manager.get_calculation(request.session_id)
        
        if not calculation_data:
            raise HTTPException(status_code=404, detail="Calculation not found")
        
        # Generate PDF
        pdf_generator = PDFGenerator()
        pdf_path = pdf_generator.generate_roi_report(
            calculation_data=calculation_data,
            include_charts=request.include_charts,
            include_analysis=request.include_analysis,
            include_recommendations=request.include_recommendations
        )
        
        # Return PDF file
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=f"roi_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.get("/templates")
async def get_pdf_templates():
    """Get available PDF template options"""
    return {
        "templates": [
            {
                "id": "standard",
                "name": "Standard Report",
                "description": "Comprehensive ROI analysis with charts and recommendations"
            },
            {
                "id": "executive",
                "name": "Executive Summary",
                "description": "Condensed report for executive review"
            },
            {
                "id": "detailed",
                "name": "Detailed Analysis",
                "description": "In-depth analysis with market research and risk assessment"
            }
        ]
    }