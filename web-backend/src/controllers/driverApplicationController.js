import { query } from "../config/db.js";

export const createDriverApplication = async (req, res, next) => {
  try {
    const {
      accountInfo,
      personalInfo,
      driversLicense,
      emergencyContact,
      vehicleInfo,
      vehicleDocuments,
      vehiclePhotos,
      vehicleOwnership,
      governmentIds,
    } = req.body;

    const missingSections = [];
    if (!accountInfo) missingSections.push("accountInfo");
    if (!personalInfo) missingSections.push("personalInfo");
    if (!driversLicense) missingSections.push("driversLicense");
    if (!emergencyContact) missingSections.push("emergencyContact");
    if (!vehicleInfo) missingSections.push("vehicleInfo");
    if (!vehicleDocuments) missingSections.push("vehicleDocuments");
    if (!vehiclePhotos) missingSections.push("vehiclePhotos");
    if (!vehicleOwnership) missingSections.push("vehicleOwnership");
    if (!governmentIds) missingSections.push("governmentIds");

    if (missingSections.length) {
      return res.status(400).json({
        message: `Missing sections: ${missingSections.join(", ")}`,
      });
    }

    const insertQuery = `
      INSERT INTO driver_applications (
        account_info,
        personal_info,
        drivers_license,
        emergency_contact,
        vehicle_info,
        vehicle_documents,
        vehicle_photos,
        vehicle_ownership,
        government_ids
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, status, created_at;
    `;

    const values = [
      accountInfo,
      personalInfo,
      driversLicense,
      emergencyContact,
      vehicleInfo,
      vehicleDocuments,
      vehiclePhotos,
      vehicleOwnership,
      governmentIds,
    ];

    const { rows } = await query(insertQuery, values);
    return res.status(201).json({
      message: "Driver application submitted",
      application: rows[0],
    });
  } catch (error) {
    return next(error);
  }
};
