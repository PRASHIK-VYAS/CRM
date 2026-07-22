import outreachService from "../service/OutreachServices.js";

function getActorId(req) {
  return req.user?.id ?? null;
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  return value === "true";
}

function handleOutreachError(res, error, fallbackMessage) {
  const message = error?.message || fallbackMessage;

  const notFoundErrors = [
    "Outreach not found",
    "Deleted outreach not found",
    "Company not found",
  ];

  const validationErrors = [
    "Created-by user is required",
    "Company is required",
    "Outreach type is required",
    "Subject is required",
    "Invalid outreach type",
    "Invalid outreach status",
    "Invalid outreach outcome",
    "Next follow-up date is required",
    "Invalid follow-up date",
  ];

  if (notFoundErrors.includes(message)) {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  if (
    validationErrors.includes(message) ||
    message.endsWith(" is invalid")
  ) {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  console.error(fallbackMessage, error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

export async function createOutreach(req, res) {
  try {
    const outreach = await outreachService.createOutreach(
      req.body,
      getActorId(req),
    );

    return res.status(201).json({
      success: true,
      message: "Outreach created successfully",
      data: outreach,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to create outreach",
    );
  }
}

export async function getOutreaches(req, res) {
  try {
    const result = await outreachService.getOutreaches({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      companyId: req.query.companyId,
      outreachType: req.query.outreachType,
      status: req.query.status,
      outcome: req.query.outcome,
      createdBy: req.query.createdBy,
      isActive: parseBoolean(req.query.isActive),
      interactionFrom: req.query.interactionFrom,
      interactionTo: req.query.interactionTo,
      followUpFrom: req.query.followUpFrom,
      followUpTo: req.query.followUpTo,
      includeDeleted:
        parseBoolean(req.query.includeDeleted) ?? false,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to load outreaches",
    );
  }
}

export async function getOutreachById(req, res) {
  try {
    const outreach = await outreachService.getOutreachById(
      req.params.id,
      {
        includeDeleted:
          parseBoolean(req.query.includeDeleted) ?? false,
      },
    );

    return res.status(200).json({
      success: true,
      data: outreach,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to load outreach",
    );
  }
}

export async function getOutreachesByCompany(req, res) {
  try {
    const result =
      await outreachService.getOutreachesByCompany(
        req.params.companyId,
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to load company outreaches",
    );
  }
}

export async function updateOutreach(req, res) {
  try {
    const outreach = await outreachService.updateOutreach(
      req.params.id,
      req.body,
      getActorId(req),
    );

    return res.status(200).json({
      success: true,
      message: "Outreach updated successfully",
      data: outreach,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to update outreach",
    );
  }
}

export async function completeOutreach(req, res) {
  try {
    const outreach =
      await outreachService.completeOutreach(
        req.params.id,
        {
          outcome: req.body.outcome,
          description: req.body.description,
          nextFollowUpDate: req.body.nextFollowUpDate,
          updatedBy: getActorId(req),
        },
      );

    return res.status(200).json({
      success: true,
      message: "Outreach completed successfully",
      data: outreach,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to complete outreach",
    );
  }
}

export async function cancelOutreach(req ,res){
  try{
    const outreach = await outreachService.cancelOutreach(req.params.id,
      {
        description: req.body.description,
        updatedBy: getActorId(req),
      },
    );
    return res.status =(200).json({
      success: true,
      message:"Outreach cancelled successfully",
      data: outreach,
    });

  }catch(error){
    return handleOutreachError(
      res, error, "Failed to cancel outreach ",
    );
  }
}


export async function markOutreachMissed(req, res){
  try{
    const outreach = await outreachService.markOutreachMissed(req.params.id, getActorId(req),);

    return res.status(200).json({
      success: true,
      message: "Outreach marked as missed",
      data : outreach,
    });
  }catch (error){
    return handleOutreachError(res, error,"Failed to mark outreach as missed",);
  }
}


export async function scheduleFollowUp(req, res) {
  try {
    const outreach =
      await outreachService.scheduleFollowUp(
        req.params.id,
        {
          nextFollowUpDate: req.body.nextFollowUpDate,
          nextSubject: req.body.nextSubject,
          createdBy: getActorId(req),
        },
      );

    return res.status(201).json({
      success: true,
      message: "Follow-up scheduled successfully",
      data: outreach,
    });
  } catch (error) {
    return handleOutreachError(
      res,
      error,
      "Failed to schedule follow-up",
    );
  }
}

export async function getUpcomingFollowUps(req, res){
  try {
    const outreaches = await outreachService.getUpcomingFollowUps({
      days:req.query.companyId,
      createdBy: req.query.createdBy,
    });

    return res.status(200).json({
      success : true,
      data : outreaches,
    });

  }catch(error){
    return handleOutreachError(
      res, error, 
    )
  }
}