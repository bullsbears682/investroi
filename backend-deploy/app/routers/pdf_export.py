from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
from sqlalchemy.orm import Session
from ..services.pdf_generator import pdf_generator_service
from ..database import get_db, ExportHistory

router = APIRouter(prefix="/pdf", tags=["PDF Export"])

class WhiteLabelConfig(BaseModel):
    company_name: str
    logo_url: Optional[str] = None
    pdf_header_text: str
    pdf_footer_text: str
    pdf_logo_url: Optional[str] = None
    primary_color: str
    website: Optional[str] = None
    contact_url: Optional[str] = None
    support_email: str
    company_address: Optional[str] = None
    phone_number: Optional[str] = None

class PDFExportRequest(BaseModel):
    calculation_data: Dict[str, Any]
    user_id: Optional[int] = None
    calculation_id: Optional[int] = None
    template_type: str = "standard"
    white_label_config: Optional[WhiteLabelConfig] = None

@router.post("/export")
async def export_pdf(request: PDFExportRequest, db: Session = Depends(get_db)):
    """Export ROI calculation as PDF"""
    try:
        # Convert white label config to dict if provided
        white_label_dict = None
        if request.white_label_config:
            white_label_dict = request.white_label_config.dict()
        
        # Generate PDF using the service
        pdf_file_path = pdf_generator_service.generate_simple_report(
            request.calculation_data,
            white_label_dict
        )
        
        # Get file size
        file_size = os.path.getsize(pdf_file_path) if os.path.exists(pdf_file_path) else 0
        filename = "roi_investment_report.pdf"
        
        # Track export in database if user is provided
        if request.user_id:
            export_record = ExportHistory(
                user_id=request.user_id,
                calculation_id=request.calculation_id,
                filename=filename,
                template_type=request.template_type,
                file_size=file_size,
                download_count=1
            )
            db.add(export_record)
            db.commit()
        
        # Return the PDF file
        return FileResponse(
            path=pdf_file_path,
            media_type="application/pdf",
            filename=filename
        )
        
    except Exception as e:
        print(f"PDF export error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation failed: {str(e)}"
        )