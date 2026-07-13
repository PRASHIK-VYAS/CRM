import crypto from "node:crypto";
import prisma from "../config/prisma.js";

const writeableFields = [
    "dealCode",
    "companyId",
    "title",
    "ownerId",
    "stage",
    "priority",
    "probability",
    "expectedStudents",
    "expectedCTC",
    "expectedHiringDate",
    "source",
    "leadOwner",
    "decisionMaker",
    "decisionMakerEmail",
    "decisionMakerPhone",
    "lastActivityDate",
    "nextFollowUpDate",
    "nextAction",
    "meetingDate",
    "proposalSentDate",
    "mouExpectedDate",
    "closeDate",
    "lostReason",
    "competitorCollege",
    "riskLevel",
    "remarks",
    "isAchieved",
];

const dateFields = [
    "expectedHiringDate",
    "nextFollowUpDate",
    "lastactivityDate",
    "meetingDate",
    "proposalSentDate",
    "mouExpectedDate",
    "closeDate",
];

const stageMap = {
    "Cold Lead" : "Cold_Lead",
    Contacted : "Contacted",
    "Meeting Scheduled" : "Meeting_Scheduled",
    "Meeting Completed" : "Meeting Completed",
    Interested : "interested",
    "Proposal Sent" : "Proposal_Sent",
    Negotiation : "Negotiation",
    "MoU Discussion" : "MoU_Discussion",
    "MoU Signed" : "MoU_Signed",
    "Hiring Started" : "Hiring_Started",
    "Strategic Partner" : "Strategic_Partner",
    "On Hold" : "On_Hold",
    Lost : "Lost",
};

const sourceMap = {
    "Cold Email" : "Cold_Email",
    Referral : "Referral",
    Alumni : "Alumni",
    Website : "Website",
    LinkedIn : "LinkedIn",
    "Campus Drive" : "Campus_Drive",
    "Previous Partner" : "Previous_Partner",
    Conference : "Conference",
    Other : "Other",
};

const stageLabels = Object.fromEntries(
    Object.entries(stageMap).map(([label, value]) => [value, label]),
);

const sourceLabels = Object.fromEntries(
    Object.entries(sourceMap).map(([label, value]) => [value, label]),
);

function normalizeEnum(value, mapping){
    if(!value){
        return value;
    }
    return mapping[value] ?? value;
}

function pickDealData(data){
    return Object.fromEntries(
        writeableFields
            .filter((field) => data[field] !== undefined)
            .map((field) => [field, data[field]]),
    );
}