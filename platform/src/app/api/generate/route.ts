import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Save to Database
    const record = await prisma.interviewRecord.create({
      data: {
        interviewerName: data.interviewerName,
        empNumber: data.empNumber,
        title: data.title,
        interviewDate: new Date(),
        departmentJob: data.departmentJob,
        applicantName: data.applicantName || "",
        nationality: data.nationality || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
        maritalStatus: data.maritalStatus || "",
        qualification: data.qualification || "",
        mostRecentJob: data.mostRecentJob || "",
        yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
        relativesInEtisalat: data.relativesInEtisalat || false,
        relativeDetails: data.relativeDetails || "",
        appearanceConfidence: data.appearanceConfidence || "",
        planningExecution: data.planningExecution || "",
        interpersonalSkills: data.interpersonalSkills || "",
        customerCentricity: data.customerCentricity || "",
        collaboration: data.collaboration || "",
        agility: data.agility || "",
        empowerment: data.empowerment || "",
        relevantExperience: data.relevantExperience || "",
        overallRating: data.overallRating || "",
        professionalComments: data.professionalComments || "",
        personalityComments: data.personalityComments || "",
        eligibilityForEmp: data.eligibilityForEmp || false,
        jobRecommendedFor: data.jobRecommendedFor || "",
        grade: data.grade || "",
        workLocation: data.workLocation || "",
        availableToJoinFrom: data.availableToJoinFrom
          ? new Date(data.availableToJoinFrom)
          : new Date(),
        otherComments: data.otherComments || "",
        signatureImage: data.signatureData || "",
      },
    });

    const format = data.outputFormat || "docx";

    if (format === "docx") {
      // Use docxtemplater to generate from the template
      const templatePath = path.resolve(process.cwd(), "public/template.docx");
      const content = fs.readFileSync(templatePath, "binary");
      const zip = new PizZip(content);

      // Handle images (Signature)
      const imageOpts = {
        centered: false,
        getImage(tagValue: string) {
          if (tagValue && tagValue.startsWith("data:image")) {
            const base64Data = tagValue.replace(/^data:image\/png;base64,/, "");
            return Buffer.from(base64Data, "base64");
          }
          return Buffer.from(tagValue || "", "base64");
        },
        getSize() {
          return [150, 50]; // Signature size
        },
      };

      const imageModule = new ImageModule(imageOpts);

      const doc = new Docxtemplater(zip, {
        modules: [imageModule],
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "+++", end: "+++" },
        nullGetter(part) {
          if (!part.module) {
            return "";
          }
          if (part.module === "rawxml") {
            return "";
          }
          return "";
        },
      });

      const getRating = (field: string, target: string) => field === target ? "X" : "";

      doc.render({
        applicantName: data.applicantName || "",
        departmentJob: data.departmentJob || "",
        interviewDate: new Date().toLocaleDateString(),
        nationality: data.nationality || "",
        dateOfBirth: data.dateOfBirth || "",
        qualification: data.qualification || "",
        maritalStatus: data.maritalStatus || "",
        mostRecentJob: data.mostRecentJob || "",
        yearsOfExperience: data.yearsOfExperience || "",

        professionalComments: data.professionalComments || "",
        personalityComments: data.personalityComments || "",
        otherComments: data.otherComments || "",
        
        relativesInEtisalat: data.relativesInEtisalat ? "Yes" : "No",
        relativeDetails: data.relativeDetails || "",

        interviewerName: data.interviewerName || "",
        empNumber: data.empNumber || "",
        title: data.title || "",
        jobRecommendedFor: data.jobRecommendedFor || "",
        eligibilityForEmp: data.eligibilityForEmp ? "Yes" : "No",

        grade: data.grade || "",
        workLocation: data.workLocation || "",
        availableToJoinFrom: data.availableToJoinFrom || "",
        signatureImage: data.signatureData || "",

        // Ratings Map
        app_L: getRating(data.appearanceConfidence, "L"),
        app_A: getRating(data.appearanceConfidence, "A"),
        app_G: getRating(data.appearanceConfidence, "G"),
        app_VG: getRating(data.appearanceConfidence, "VG"),
        app_O: getRating(data.appearanceConfidence, "O"),

        plan_L: getRating(data.planningExecution, "L"),
        plan_A: getRating(data.planningExecution, "A"),
        plan_G: getRating(data.planningExecution, "G"),
        plan_VG: getRating(data.planningExecution, "VG"),
        plan_O: getRating(data.planningExecution, "O"),

        inter_L: getRating(data.interpersonalSkills, "L"),
        inter_A: getRating(data.interpersonalSkills, "A"),
        inter_G: getRating(data.interpersonalSkills, "G"),
        inter_VG: getRating(data.interpersonalSkills, "VG"),
        inter_O: getRating(data.interpersonalSkills, "O"),

        cust_L: getRating(data.customerCentricity, "L"),
        cust_A: getRating(data.customerCentricity, "A"),
        cust_G: getRating(data.customerCentricity, "G"),
        cust_VG: getRating(data.customerCentricity, "VG"),
        cust_O: getRating(data.customerCentricity, "O"),

        collab_L: getRating(data.collaboration, "L"),
        collab_A: getRating(data.collaboration, "A"),
        collab_G: getRating(data.collaboration, "G"),
        collab_VG: getRating(data.collaboration, "VG"),
        collab_O: getRating(data.collaboration, "O"),

        agil_L: getRating(data.agility, "L"),
        agil_A: getRating(data.agility, "A"),
        agil_G: getRating(data.agility, "G"),
        agil_VG: getRating(data.agility, "VG"),
        agil_O: getRating(data.agility, "O"),

        emp_L: getRating(data.empowerment, "L"),
        emp_A: getRating(data.empowerment, "A"),
        emp_G: getRating(data.empowerment, "G"),
        emp_VG: getRating(data.empowerment, "VG"),
        emp_O: getRating(data.empowerment, "O"),

        rel_L: getRating(data.relevantExperience, "L"),
        rel_A: getRating(data.relevantExperience, "A"),
        rel_G: getRating(data.relevantExperience, "G"),
        rel_VG: getRating(data.relevantExperience, "VG"),
        rel_O: getRating(data.relevantExperience, "O"),

        overall_L: getRating(data.overallRating, "L"),
        overall_A: getRating(data.overallRating, "A"),
        overall_G: getRating(data.overallRating, "G"),
        overall_VG: getRating(data.overallRating, "VG"),
        overall_O: getRating(data.overallRating, "O"),
      });

      const buf = doc.getZip().generate({ type: "nodebuffer" });

      return new NextResponse(buf, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="Interview_Report_${data.applicantName?.replace(/\s+/g, "_") || "Candidate"}.docx"`,
        },
      });
    }

    return NextResponse.json({ success: true, recordId: record.id });
  } catch (error: any) {
    console.error("Full error:", error);
    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors.map(function (error: any) {
        return error.properties.explanation;
      }).join("\n");
      console.log('errorMessages', errorMessages);
    }
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
