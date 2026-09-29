import zipfile
import re
import os

source_file = r"c:\AntiGravity_Apps\Interview_Feedback\Updated Interview Report Form.docx"
target_file = r"c:\AntiGravity_Apps\Interview_Feedback\platform\public\template.docx"
temp_dir = r"c:\AntiGravity_Apps\Interview_Feedback\platform\public\temp_docx"

# Extract the docx
with zipfile.ZipFile(source_file, 'r') as zip_ref:
    zip_ref.extractall(temp_dir)

doc_xml_path = os.path.join(temp_dir, 'word', 'document.xml')
with open(doc_xml_path, 'r', encoding='utf-8') as f:
    xml_content = f.read()

# We will do string replacement on the raw XML to preserve runs perfectly.
# Note: In Word XML, text is inside <w:t> tags. 
# Sometimes text is split across multiple <w:t> tags.
# But for a brand new document, simple labels like "Applicant  Name" are usually in one <w:t> tag.
# Let's remove all XML tags temporarily to see if it's safe? No, that breaks formatting.
# We will do a safe regex replacement for known exact strings.

replacements = {
    "Applicant  Name": "Applicant Name: +++applicantName+++",
    "Dep/Job Interview For": "Dep/Job Interview For: +++departmentJob+++",
    "Nationality": "Nationality: +++nationality+++",
    "Date of Birth": "Date of Birth: +++dateOfBirth+++",
    "Qualification": "Qualification: +++qualification+++",
    "Marital Status": "Marital Status: +++maritalStatus+++",
    "Most Recent Job Held": "Most Recent Job Held: +++mostRecentJob+++",
    "Year of Relevant Experience": "Year of Relevant Experience: +++yearsOfExperience+++",
    "Professional (e.g. academic qualification, technical training, and experience)": "Professional Comments: +++professionalComments+++",
    "Personality (e.g. behaviour, attitude, and presentation)": "Personality Comments: +++personalityComments+++",
    "Other Comments": "Other Comments: +++otherComments+++",
    "Interviewer’s Name": "Interviewer Name: +++interviewerName+++",
    "Emp #": "Emp #: +++empNumber+++",
    "Job Recommended for": "Job Recommended for: +++jobRecommendedFor+++"
}

# The original Date is just "Date". Let's handle it carefully.
xml_content = xml_content.replace(">Date<", ">Date: +++interviewDate+++<")
xml_content = xml_content.replace(">Title<", ">Title: +++title+++<")

# "Grade:  Work Location:   Available to join from:  "
xml_content = xml_content.replace(">Grade:<", ">Grade: +++grade+++<")
xml_content = xml_content.replace(">Work Location:<", ">Work Location: +++workLocation+++<")
xml_content = xml_content.replace(">Available to join from:<", ">Available to join from: +++availableToJoinFrom+++<")

for search, replace in replacements.items():
    xml_content = xml_content.replace(search, replace)

with open(doc_xml_path, 'w', encoding='utf-8') as f:
    f.write(xml_content)

# Repackage the docx
with zipfile.ZipFile(target_file, 'w', zipfile.ZIP_DEFLATED) as docx_zip:
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, temp_dir)
            docx_zip.write(file_path, arcname)

print(f"Clean template saved to {target_file}")
