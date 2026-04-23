import { APIError, ExternalApiError } from "../middleware/error-handler.js";
import { validateProfileCreate } from "../utils/validator.js";
import { ProfileRepository } from "../repository/profile-repository.js";
import { assignGroup, capitalize, selectCountry } from "../utils/functions.js";

const DbProfile = new ProfileRepository();

export async function getProfiles(req, res) {
  const {
    gender = undefined,
    age_group = undefined,
    country_id = undefined,
    min_age = undefined,
    max_age = undefined,
    min_gender_probability = undefined,
    max_gender_probability = undefined,
    page,
    limit,
    sort_by,
    order,
  } = req.query;

  const response = await DbProfile.getMany({
    gender: gender,
    age_group,
    country_id,
    min_age: parseInt(min_age) || undefined,
    max_age: parseInt(max_age) || undefined,
    min_gender_probability: parseFloat(min_gender_probability) || undefined,
    max_gender_probability: parseFloat(max_gender_probability) || undefined,
    page,
    limit,
    sort_by,
    order,
  });

  return res.status(200).json({
    status: "success",
    page: response.page,
    limit: response.limit,
    total: 2026,
    data: response.data,
  });
}

export async function searchForProfile(req, res) {
  const query = req.query.q;

  const q = query.toLowerCase();

  const parsedQuery = {};

  const known_age_group = ["child", "teenager", "adult", "elder"];

  if (!q) throw new APIError("Unable to interpret query", 400);

  if (q.includes("young")) {
    parsedQuery.max_age = 24;
    parsedQuery.min_age = 16;
  }

  if (q.includes("female")) {
    parsedQuery.gender = "female";
  } else if (q.includes("male") && !q.includes("female")) {
    parsedQuery.gender = "male";
  } else if (q.split(" ").includes("male") && q.includes("female")) {
    parsedQuery.gender = undefined;
  }

  if (q.includes("from")) {
    if (q.split("from ")[1].trim().includes(" "))
      throw new APIError("Unable to interpret query", 400);

    parsedQuery.country_name = capitalize(q.split("from ")[1]);
  }

  if (q.includes("above")) {
    parsedQuery.min_age = parseInt(q.split("above ")[1]);
  }

  if (q.includes("below")) {
    parsedQuery.max_age = parseInt(q.split("below ")[1]);
  }

  if (q.includes(known_age_group[0])) {
    parsedQuery.age_group = known_age_group[0];
  } else if (q.includes(known_age_group[1])) {
    parsedQuery.age_group = known_age_group[1];
  } else if (q.includes(known_age_group[2])) {
    parsedQuery.age_group = known_age_group[2];
  } else if (q.includes(known_age_group[3])) {
    parsedQuery.age_group = known_age_group[3];
  }

  if (Object.keys(parsedQuery).length === 0) {
    throw new APIError("Unable to interpret query", 400);
  }

  const response = await DbProfile.getMany(parsedQuery);

  return res.status(200).json({
    status: "success",
    page: response.page,
    limit: response.limit,
    total: 2026,
    data: response.data,
  });
}

// "young males"                          → gender=male + min_age=16 + max_age=24
// "females above 30"                     → gender=female + min_age=30
// "people from angola"                   → country_id=AO
// "adult males from kenya"               → gender=male + age_group=adult + country_id=KE
// "male and female teenagers above 17"   → age_group=teenager + min_age=17
