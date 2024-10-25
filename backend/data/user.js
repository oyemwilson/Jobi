import bcrypt from 'bcryptjs'

const users = [
    {
        firstName: 'Admin ',
        lastName:"User",
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        mobile: +23477885566,
        role: "admin",
        verified: true,
        qualification: "bsc, ond",
        isAdmin: true,
        isEmployer: false,
    },
    {
        firstName: 'John ',
        lastName: 'Prince',
        email: 'John@example.com',
        password: bcrypt.hashSync('123456', 10),
        mobile: +23477885566,
        role: "applicant",
        verified: true,
        qualification: "bsc, ond",
        isEmployer: false,
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'Jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        mobile: +23477885566,
        role: "employer",
        verified: true,
        qualification: "bsc, ond",
        isEmployer: false,

    },
    
]
export default users