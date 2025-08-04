from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any
import os
from ..services.pdf_generator import pdf_generator_service

router = APIRouter(prefix="/pdf", tags=["PDF Export"])

class PDFExportRequest(BaseModel):
    calculation_data: Dict[str, Any]

@router.post("/export")
async def export_pdf(request: PDFExportRequest):
    """Export ROI calculation as PDF"""
    try:
        # Generate PDF using the service
        pdf_file_path = pdf_generator_service.generate_simple_report(
            request.calculation_data
        )
        
        # Return the PDF file
        return FileResponse(
            path=pdf_file_path,
            media_type="application/pdf",
            filename="roi_investment_report.pdf"
        )
        
    except Exception as e:
        print(f"PDF export error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation failed: {str(e)}"
        )