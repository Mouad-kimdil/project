const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const Testimonial = require('../models/Testimonial');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const seedData = async () => {
  try {
    // Clean up existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Opportunity.deleteMany();
    await Testimonial.deleteMany();

    console.log('Data cleaned...');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user created...');

    // Create events
    const events = [
      {
        title: 'Community Cleanup Day',
        date: '2023-08-15',
        startTime: '9:00 AM',
        endTime: '2:00 PM',
        location: 'Central Park',
        organizer: 'Green Earth Initiative',
        description: 'Join us for a day of cleaning up our community parks and streets. We\'ll provide all necessary supplies including gloves, trash bags, and tools. Lunch will be provided for all volunteers.',
        contactEmail: 'info@greenearthinitiative.org',
        image: '/uploads/default-event.jpg',
        user: admin._id
      },
      {
        title: 'Food Drive',
        date: '2023-09-05',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        location: 'Community Center',
        organizer: 'Community Helpers',
        description: 'Help us collect food for families in need in our community. We are looking for non-perishable food items that will be distributed to local food banks.',
        contactEmail: 'info@communityhelpers.org',
        image: '/uploads/default-event.jpg',
        user: admin._id
      },
      {
        title: 'Charity Run',
        date: '2023-10-10',
        startTime: '8:00 AM',
        endTime: '12:00 PM',
        location: 'Riverside Park',
        organizer: 'Hope Foundation',
        description: 'Annual 5K run to raise funds for local children\'s hospital. Registration is $25 and includes a t-shirt and refreshments.',
        contactEmail: 'info@hopefoundation.org',
        image: '/uploads/default-event.jpg',
        user: admin._id
      }
    ];

    await Event.insertMany(events);
    console.log('Events created...');

    // Create opportunities
    const opportunities = [
      {
        title: 'Homeless Shelter Assistant',
        organization: 'City Shelter',
        location: 'Downtown',
        category: 'Social Services',
        commitment: 'Weekly, 3-4 hours',
        description: 'Help prepare and serve meals at the local homeless shelter. Tasks include food preparation, serving meals, cleaning up, and interacting with shelter residents.',
        requirements: 'Must be 18+, Background check required',
        skills: ['Food preparation', 'Customer service', 'Empathy'],
        contactEmail: 'volunteer@cityshelter.org',
        contactPhone: '(555) 123-4567',
        image: '/uploads/default-opportunity.jpg',
        user: admin._id
      },
      {
        title: 'Reading Buddy',
        organization: 'Public Library',
        location: 'Various Locations',
        category: 'Education',
        commitment: 'Weekly, 2 hours',
        description: 'Read with children to improve their literacy skills. Volunteers will be paired with children ages 6-12 who need extra help with reading.',
        requirements: 'Must be 16+, Background check required',
        skills: ['Patience', 'Teaching', 'Communication'],
        contactEmail: 'volunteer@publiclibrary.org',
        contactPhone: '(555) 987-6543',
        image: '/uploads/default-opportunity.jpg',
        user: admin._id
      },
      {
        title: 'Wildlife Conservation Volunteer',
        organization: 'Nature Conservancy',
        location: 'National Park',
        category: 'Environment',
        commitment: 'Monthly, Full day',
        description: 'Help with habitat restoration and wildlife monitoring. Activities include planting native species, removing invasive plants, and tracking wildlife populations.',
        requirements: 'Must be 18+, Outdoor experience preferred',
        skills: ['Physical stamina', 'Environmental knowledge', 'Teamwork'],
        contactEmail: 'volunteer@natureconservancy.org',
        contactPhone: '(555) 456-7890',
        image: '/uploads/default-opportunity.jpg',
        user: admin._id
      }
    ];

    await Opportunity.insertMany(opportunities);
    console.log('Opportunities created...');

    // Create testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Environmental Volunteer',
        quote: 'Volunteering with this organization has been one of the most rewarding experiences of my life. I\'ve met amazing people and made a real difference in my community.',
        image: '/uploads/default-avatar.jpg',
        user: admin._id
      },
      {
        name: 'Michael Chen',
        role: 'Youth Mentor',
        quote: 'The support and training I received made me feel confident in my role as a mentor. Seeing the impact on the kids I work with is incredibly fulfilling.',
        image: '/uploads/default-avatar.jpg',
        user: admin._id
      },
      {
        name: 'Aisha Patel',
        role: 'Food Bank Volunteer',
        quote: 'I started volunteering during the pandemic and haven\'t stopped since. The team is so welcoming and the work we do helps so many families in need.',
        image: '/uploads/default-avatar.jpg',
        user: admin._id
      },
      {
        name: 'David Rodriguez',
        role: 'Community Organizer',
        quote: 'This platform made it easy to find opportunities that matched my skills and schedule. I\'ve been able to contribute in ways I never thought possible.',
        image: '/uploads/default-avatar.jpg',
        user: admin._id
      }
    ];

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials created...');

    console.log('Data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();