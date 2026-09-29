import docx
import os

source_file = r"c:\AntiGravity_Apps\Interview_Feedback\Updated Interview Report Form.docx"
target_file = r"c:\AntiGravity_Apps\Interview_Feedback\platform\public\template.docx"

doc = docx.Document(source_file)

def replace_in_cell(cell, search, replace):
    for p in cell.paragraphs:
        if search in p.text:
            p.text = p.text.replace(search, replace)

def replace_in_doc(doc):
    # For strict string replacements across all paragraphs (so we don't hit the same thing multiple times)
    replacements = {
        "Applicant  Name": "Applicant Name: {{applicantName}}",
        "Dep/Job Interview For": "Dep/Job Interview For: {{departmentJob}}",
        "Date": "Date: {{interviewDate}}",
        "Nationality": "Nationality: {{nationality}}",
        "Date of Birth": "Date of Birth: {{dateOfBirth}}",
        "Qualification": "Qualification: {{qualification}}",
        "Marital Status": "Marital Status: {{maritalStatus}}",
        "Most Recent Job Held": "Most Recent Job Held: {{mostRecentJob}}",
        "Year of Relevant Experience": "Year of Relevant Experience: {{yearsOfExperience}}",
        "Professional (e.g. academic qualification, technical training, and experience)": "Professional Comments: {{professionalComments}}",
        "Personality (e.g. behaviour, attitude, and presentation)": "Personality Comments: {{personalityComments}}",
        "Other Comments": "Other Comments: {{otherComments}}",
        "Interviewer’s Name": "Interviewer Name: {{interviewerName}}",
        "Emp #": "Emp #: {{empNumber}}",
        "Title": "Title: {{title}}",
        "Job Recommended for": "Job Recommended for: {{jobRecommendedFor}}",
        "Grade:  Work Location:   Available to join from:  ": "Grade: {{grade}}   Work Location: {{workLocation}}   Available to join from: {{availableToJoinFrom}}"
    }

    # Iterate through all paragraphs in the document
    for p in doc.paragraphs:
        for search, replace in replacements.items():
            if search in p.text:
                p.text = p.text.replace(search, replace)

    # Iterate through all tables, rows, cells, and paragraphs
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for search, replace in replacements.items():
                        if search in p.text:
                            # To avoid multiple replacements if cell is merged and python-docx sees it multiple times
                            if replace not in p.text:
                                p.text = p.text.replace(search, replace)
                            
    doc.save(target_file)
    print(f"Template saved to {target_file}")

replace_in_doc(doc)
