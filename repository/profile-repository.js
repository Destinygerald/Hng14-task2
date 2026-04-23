import { prisma } from "../lib/prisma.js";
import { Profile } from "../models/profiles.js";

export class ProfileRepository {
  constructor() {
    this.prisma = prisma;
  }

  async create(data) {
    const response = await this.prisma.profile.create({
      data: data,
    });

    return response;
  }

  async createMany(data) {
    const response = await this.prisma.profile.createMany({
      data: data,
    });

    return response;
  }

  async getMany(query) {
    const page = query.page || 1;
    const pageSize = query.limit <= 50 && query.limit >= 10 ? query.limit : 10;

    const skip = (page - 1) * pageSize;

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.profile.findMany({
        where: {
          gender: query.gender,
          age_group: query.age_group,
          country_name: query.country_name,
          age: {
            gte: query.min_age,
            lte: query.max_age,
          },
          gender_probability: {
            gte: query.min_gender_probability,
          },
          country_probability: {
            gte: query.min_country_probability,
          },
        },
        take: parseInt(pageSize),
        skip: parseInt(skip),
        orderBy: {
          [query.sort_by || "created_at"]: query.order || "asc",
        },
      }),
      this.prisma.profile.count({
        where: {
          gender: query.gender,
          age_group: query.age_group,
          country_name: query.country_name,
          age: {
            gte: query.min_age,
            lte: query.max_age,
          },
          gender_probability: {
            gte: query.min_gender_probability,
          },
          country_probability: {
            gte: query.min_country_probability,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data,
      totalPages,
      limit: pageSize,
      page,
    };
  }
}
