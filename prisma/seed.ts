import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const colleges = [
  {
    name: "Delhi Institute of Technology",
    slug: "delhi-institute-of-technology",
    location: "Delhi",
    fees: 185000,
    rating: 4.6,
    averagePlacement: 850000,
    highestPlacement: 3200000,
    overview:
      "A technology-focused institution offering strong undergraduate programs in engineering, computer science and applied technology.",
    courses: ["B.Tech Computer Science", "B.Tech Information Technology", "B.Tech Electronics"],
  },
  {
    name: "Noida Institute of Engineering and Technology",
    slug: "noida-institute-of-engineering-and-technology",
    location: "Greater Noida",
    fees: 145000,
    rating: 4.3,
    averagePlacement: 650000,
    highestPlacement: 2800000,
    overview:
      "A leading engineering college known for technical education, industry exposure and placement opportunities.",
    courses: ["B.Tech Computer Science", "B.Tech AI & ML", "B.Tech Mechanical Engineering"],
  },
  {
    name: "Amity University Noida",
    slug: "amity-university-noida",
    location: "Noida",
    fees: 310000,
    rating: 4.5,
    averagePlacement: 900000,
    highestPlacement: 3600000,
    overview:
      "A private university offering a wide range of technology and management programs with modern campus facilities.",
    courses: ["B.Tech Computer Science", "B.Tech Data Science", "B.Tech Biotechnology"],
  },
  {
    name: "Jaypee Institute of Information Technology",
    slug: "jaypee-institute-of-information-technology",
    location: "Noida",
    fees: 240000,
    rating: 4.7,
    averagePlacement: 1050000,
    highestPlacement: 4200000,
    overview:
      "A technology-oriented university with strong academic programs in computer science, engineering and information technology.",
    courses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mathematics & Computing"],
  },
  {
    name: "Sharda University",
    slug: "sharda-university",
    location: "Greater Noida",
    fees: 220000,
    rating: 4.2,
    averagePlacement: 600000,
    highestPlacement: 2400000,
    overview:
      "A multidisciplinary university providing undergraduate and postgraduate education across technology and other fields.",
    courses: ["B.Tech Computer Science", "B.Tech AI & ML", "B.Tech Civil Engineering"],
  },
  {
    name: "Galgotias University",
    slug: "galgotias-university",
    location: "Greater Noida",
    fees: 175000,
    rating: 4.4,
    averagePlacement: 700000,
    highestPlacement: 3300000,
    overview:
      "A modern university focused on technology education, innovation and career-oriented learning.",
    courses: ["B.Tech Computer Science", "B.Tech Cyber Security", "B.Tech AI & ML"],
  },
  {
    name: "KIET Group of Institutions",
    slug: "kiet-group-of-institutions",
    location: "Ghaziabad",
    fees: 155000,
    rating: 4.5,
    averagePlacement: 720000,
    highestPlacement: 3800000,
    overview:
      "An engineering institution offering technical programs with strong industry connections and placement support.",
    courses: ["B.Tech Computer Science", "B.Tech IT", "B.Tech Electronics"],
  },
  {
    name: "Ajay Kumar Garg Engineering College",
    slug: "ajay-kumar-garg-engineering-college",
    location: "Ghaziabad",
    fees: 135000,
    rating: 4.3,
    averagePlacement: 680000,
    highestPlacement: 3100000,
    overview:
      "An established engineering college providing practical technical education and industry-oriented programs.",
    courses: ["B.Tech Computer Science", "B.Tech Information Technology", "B.Tech Mechanical"],
  },
  {
    name: "Maharaja Surajmal Institute of Technology",
    slug: "maharaja-surajmal-institute-of-technology",
    location: "Delhi",
    fees: 115000,
    rating: 4.4,
    averagePlacement: 780000,
    highestPlacement: 3000000,
    overview:
      "A Delhi-based engineering institute offering affordable technical education and strong placement opportunities.",
    courses: ["B.Tech Computer Science", "B.Tech IT", "B.Tech Electronics"],
  },
  {
    name: "Netaji Subhas University of Technology",
    slug: "netaji-subhas-university-of-technology",
    location: "Delhi",
    fees: 95000,
    rating: 4.8,
    averagePlacement: 1450000,
    highestPlacement: 5000000,
    overview:
      "A leading public technical university known for engineering education, research and excellent placement outcomes.",
    courses: ["B.Tech Computer Science", "B.Tech Mathematics & Computing", "B.Tech Electronics"],
  },
  {
    name: "Delhi Technological University",
    slug: "delhi-technological-university",
    location: "Delhi",
    fees: 110000,
    rating: 4.8,
    averagePlacement: 1600000,
    highestPlacement: 5500000,
    overview:
      "A premier technical university offering engineering programs with strong academic and industry exposure.",
    courses: ["B.Tech Computer Science", "B.Tech Software Engineering", "B.Tech Electrical Engineering"],
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "indian-institute-of-technology-delhi",
    location: "Delhi",
    fees: 225000,
    rating: 4.9,
    averagePlacement: 2200000,
    highestPlacement: 9000000,
    overview:
      "A premier engineering and research institute offering highly competitive programs across technology and science.",
    courses: ["B.Tech Computer Science", "B.Tech Electrical Engineering", "B.Tech Mechanical Engineering"],
  },
  {
    name: "Indian Institute of Technology Kanpur",
    slug: "indian-institute-of-technology-kanpur",
    location: "Kanpur",
    fees: 215000,
    rating: 4.9,
    averagePlacement: 2300000,
    highestPlacement: 10000000,
    overview:
      "A globally recognized technical institute with strong research, engineering and innovation programs.",
    courses: ["B.Tech Computer Science", "B.Tech Mathematics & Scientific Computing", "B.Tech Aerospace Engineering"],
  },
  {
    name: "Indian Institute of Technology Roorkee",
    slug: "indian-institute-of-technology-roorkee",
    location: "Roorkee",
    fees: 210000,
    rating: 4.9,
    averagePlacement: 2100000,
    highestPlacement: 8500000,
    overview:
      "One of India's oldest technical institutions with strong engineering education and research programs.",
    courses: ["B.Tech Computer Science", "B.Tech Civil Engineering", "B.Tech Electronics"],
  },
  {
    name: "National Institute of Technology Delhi",
    slug: "national-institute-of-technology-delhi",
    location: "Delhi",
    fees: 155000,
    rating: 4.6,
    averagePlacement: 1100000,
    highestPlacement: 4500000,
    overview:
      "A national-level technical institute focused on engineering education, research and innovation.",
    courses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Electrical Engineering"],
  },
  {
    name: "MNNIT Allahabad",
    slug: "mnnit-allahabad",
    location: "Prayagraj",
    fees: 165000,
    rating: 4.7,
    averagePlacement: 1250000,
    highestPlacement: 4800000,
    overview:
      "A premier institute offering engineering and technology programs with strong academic and placement records.",
    courses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mechanical Engineering"],
  },
  {
    name: "Harcourt Butler Technical University",
    slug: "harcourt-butler-technical-university",
    location: "Kanpur",
    fees: 90000,
    rating: 4.5,
    averagePlacement: 700000,
    highestPlacement: 3000000,
    overview:
      "A public technical university known for engineering programs and affordable higher education.",
    courses: ["B.Tech Computer Science", "B.Tech Information Technology", "B.Tech Chemical Engineering"],
  },
  {
    name: "University of Lucknow",
    slug: "university-of-lucknow",
    location: "Lucknow",
    fees: 85000,
    rating: 4.2,
    averagePlacement: 550000,
    highestPlacement: 2200000,
    overview:
      "A historic university offering technology and multidisciplinary academic programs.",
    courses: ["B.Tech Computer Science", "BCA", "MCA"],
  },
  {
    name: "Bennett University",
    slug: "bennett-university",
    location: "Greater Noida",
    fees: 350000,
    rating: 4.3,
    averagePlacement: 850000,
    highestPlacement: 2800000,
    overview:
      "A private university focused on technology, entrepreneurship, media and modern industry-oriented education.",
    courses: ["B.Tech Computer Science", "B.Tech AI", "B.Tech Electronics"],
  },
  {
    name: "Shiv Nadar University",
    slug: "shiv-nadar-university",
    location: "Greater Noida",
    fees: 330000,
    rating: 4.6,
    averagePlacement: 1000000,
    highestPlacement: 4500000,
    overview:
      "A research-focused university providing interdisciplinary education with strong technology programs.",
    courses: ["B.Tech Computer Science", "B.Tech Electrical Engineering", "B.Sc Computer Science"],
  },
  {
    name: "Jaypee University of Information Technology",
    slug: "jaypee-university-of-information-technology",
    location: "Solan",
    fees: 230000,
    rating: 4.4,
    averagePlacement: 800000,
    highestPlacement: 3500000,
    overview:
      "A technology-focused university offering engineering and computing programs in a research-oriented environment.",
    courses: ["B.Tech Computer Science", "B.Tech AI & Data Science", "B.Tech Electronics"],
  },
  {
    name: "Chandigarh University",
    slug: "chandigarh-university",
    location: "Mohali",
    fees: 190000,
    rating: 4.3,
    averagePlacement: 750000,
    highestPlacement: 3600000,
    overview:
      "A large private university offering technology programs with industry exposure and modern infrastructure.",
    courses: ["B.Tech Computer Science", "B.Tech AI & ML", "B.Tech Cyber Security"],
  },
  {
    name: "Lovely Professional University",
    slug: "lovely-professional-university",
    location: "Phagwara",
    fees: 180000,
    rating: 4.2,
    averagePlacement: 650000,
    highestPlacement: 3000000,
    overview:
      "A multidisciplinary private university offering technology, management and professional programs.",
    courses: ["B.Tech Computer Science", "B.Tech IT", "B.Tech Data Science"],
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    slug: "thapar-institute-of-engineering-and-technology",
    location: "Patiala",
    fees: 320000,
    rating: 4.7,
    averagePlacement: 1150000,
    highestPlacement: 5000000,
    overview:
      "A well-established engineering institute known for technical education, research and industry collaboration.",
    courses: ["B.E. Computer Engineering", "B.E. Electronics", "B.E. Mechanical Engineering"],
  },
  {
    name: "Manipal Institute of Technology",
    slug: "manipal-institute-of-technology",
    location: "Manipal",
    fees: 350000,
    rating: 4.6,
    averagePlacement: 950000,
    highestPlacement: 5500000,
    overview:
      "A prominent engineering institute offering technology education with strong industry and research exposure.",
    courses: ["B.Tech Computer Science", "B.Tech Information Technology", "B.Tech Electronics"],
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vellore-institute-of-technology",
    location: "Vellore",
    fees: 250000,
    rating: 4.7,
    averagePlacement: 900000,
    highestPlacement: 7000000,
    overview:
      "A leading private technical institution offering diverse engineering and technology programs.",
    courses: ["B.Tech Computer Science", "B.Tech AI & ML", "B.Tech Information Security"],
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-institute-of-science-and-technology",
    location: "Chennai",
    fees: 275000,
    rating: 4.5,
    averagePlacement: 800000,
    highestPlacement: 5200000,
    overview:
      "A private university offering engineering and technology education with extensive campus facilities.",
    courses: ["B.Tech Computer Science", "B.Tech AI", "B.Tech Electronics"],
  },
  {
    name: "PSG College of Technology",
    slug: "psg-college-of-technology",
    location: "Coimbatore",
    fees: 95000,
    rating: 4.7,
    averagePlacement: 900000,
    highestPlacement: 4000000,
    overview:
      "A reputed technical institution known for engineering education, practical learning and industry connections.",
    courses: ["B.E. Computer Science", "B.E. Information Technology", "B.E. Electronics"],
  },
  {
    name: "College of Engineering Pune",
    slug: "college-of-engineering-pune",
    location: "Pune",
    fees: 85000,
    rating: 4.8,
    averagePlacement: 1100000,
    highestPlacement: 4500000,
    overview:
      "A historic engineering institution offering affordable technical education and strong placement opportunities.",
    courses: ["B.Tech Computer Science", "B.Tech Electrical Engineering", "B.Tech Mechanical Engineering"],
  },
  {
    name: "VJTI Mumbai",
    slug: "vjti-mumbai",
    location: "Mumbai",
    fees: 80000,
    rating: 4.8,
    averagePlacement: 1200000,
    highestPlacement: 5000000,
    overview:
      "A premier public engineering institute offering high-quality technical education in Mumbai.",
    courses: ["B.Tech Computer Engineering", "B.Tech IT", "B.Tech Electronics"],
  },
  {
    name: "International Institute of Information Technology Hyderabad",
    slug: "iiit-hyderabad",
    location: "Hyderabad",
    fees: 320000,
    rating: 4.9,
    averagePlacement: 2100000,
    highestPlacement: 8500000,
    overview:
      "A research-driven institute specializing in computer science, artificial intelligence and information technology.",
    courses: ["B.Tech Computer Science", "B.Tech AI & ML", "B.Tech Computing"],
  },
];

const reviewTexts = [
  "Great academic environment with supportive faculty and useful industry exposure.",
  "The campus facilities are good and the course structure is well organized.",
  "Placement opportunities are decent and students get exposure to several companies.",
  "Good option for students looking for a balance between academics and career preparation.",
  "The technical clubs and practical projects make the learning experience better.",
];

async function main() {
  console.log("Starting database seed...");

  const password = await bcrypt.hash("CollegeFinder@123", 12);

  const users = [];

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: {
        email: `demo${i}@collegefinder.dev`,
      },
      update: {},
      create: {
        name: `Demo User ${i}`,
        email: `demo${i}@collegefinder.dev`,
        password,
        emailVerified: new Date(),
      },
    });

    users.push(user);
  }

  for (let index = 0; index < colleges.length; index++) {
    const collegeData = colleges[index];

    const college = await prisma.college.upsert({
      where: {
        slug: collegeData.slug,
      },
      update: {
        name: collegeData.name,
        location: collegeData.location,
        fees: collegeData.fees,
        rating: collegeData.rating,
        averagePlacement: collegeData.averagePlacement,
        highestPlacement: collegeData.highestPlacement,
        overview: collegeData.overview,
      },
      create: {
        name: collegeData.name,
        slug: collegeData.slug,
        location: collegeData.location,
        fees: collegeData.fees,
        rating: collegeData.rating,
        averagePlacement: collegeData.averagePlacement,
        highestPlacement: collegeData.highestPlacement,
        overview: collegeData.overview,
      },
    });

    await prisma.course.deleteMany({
      where: {
        collegeId: college.id,
      },
    });

    await prisma.course.createMany({
      data: collegeData.courses.map((courseName) => ({
        name: courseName,
        collegeId: college.id,
      })),
    });

    await prisma.review.deleteMany({
      where: {
        collegeId: college.id,
      },
    });

    await prisma.review.createMany({
      data: users.slice(0, 2).map((user, reviewIndex) => ({
        rating: Math.min(
          5,
          Math.max(
            1,
            Math.round(college.rating) - (reviewIndex === 1 ? 1 : 0),
          ),
        ),
        content: reviewTexts[(index + reviewIndex) % reviewTexts.length],
        userId: user.id,
        collegeId: college.id,
      })),
    });
  }

  console.log(`Created/updated ${colleges.length} colleges`);
  console.log(`Created/updated ${users.length} demo users`);
  console.log("Courses and reviews seeded");
  console.log("Database seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });