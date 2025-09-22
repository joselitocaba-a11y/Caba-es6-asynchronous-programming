class Student {
    constructor(id, name, age, course) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
    }
    
    introduce() {
        return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${this.course}.`;
    }
}

class Instructor {
    constructor(id, name, subject, teaches) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.teaches = teaches;
    }
    
    teach() {
        return `I am ${this.name} and I teach ${this.subject}.`;
    }
}

const jsonData = {
    "students": [
        {
            "id": 1,
            "name": "Ana",
            "age": 20,
            "course": "Computer Science"
        },
        {
            "id": 2,
            "name": "Mark",
            "age": 22,
            "course": "Information Technology"
        },
        {
            "id": 3,
            "name": "John",
            "age": 19,
            "course": "Software Engineering"
        },
        {
            "id": 4,
            "name": "Maria",
            "age": 23,
            "course": "Data Science"
        },
        {
            "id": 5,
            "name": "James",
            "age": 21,
            "course": "Cybersecurity"
        }
    ],
    "courses": [
        {
            "title": "Computer Science",
            "description": "Study of algorithms, programming, and computing systems."
        },
        {
            "title": "Information Technology",
            "description": "Focus on managing and deploying computer systems and networks."
        },
        {
            "title": "Software Engineering",
            "description": "Application of engineering principles to software development."
        },
        {
            "title": "Data Science",
            "description": "Exploration of data analysis, visualization, and machine learning."
        },
        {
            "title": "Cybersecurity",
            "description": "Protection of systems, networks, and programs from cyber threats."
        }
    ],
    "instructors": [
        {
            "id": 1,
            "name": "John Rey Silverio",
            "subject": "Modern JavaScript & Next.js Prerequisites",
            "teaches": "Computer Science"
        },
        {
            "id": 2,
            "name": "Maria Santos",
            "subject": "Data Science Fundamentals",
            "teaches": "Data Science"
        },
        {
            "id": 3,
            "name": "Carlos Dela Cruz",
            "subject": "Cybersecurity and Networks",
            "teaches": "Cybersecurity"
        }
    ]
};

let students = [];
let instructors = [];
let courses = [];

function logToConsole(message) {
    console.log(message);
    const consoleDiv = document.getElementById('console');
    consoleDiv.textContent += message + '\n';
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function clearConsole() {
    document.getElementById('console').textContent = '';
}

function simulateFetch(data, delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: () => Promise.resolve(data)
            });
        }, delay);
    });
}

async function safeFetch() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        logToConsole('⚠️ Fetch failed, using embedded data instead');
        logToConsole('💡 To use external JSON, serve files via HTTP server');
        return jsonData;
    }
}

function loadWithPromises() {
    clearConsole();
    logToConsole('=== Loading Data with Promises ===');
    logToConsole('Attempting to fetch data.json...');
    
    safeFetch()
        .then(data => {
            logToConsole('✅ Data loaded successfully!');
            logToConsole('Students Data:');
            logToConsole(JSON.stringify(data.students, null, 2));
            
            createInstances(data);
            logToConsole('\n🎓 Student Introductions:');
            students.forEach(student => {
                logToConsole(`- ${student.introduce()}`);
            });
            
            logToConsole('\n👨‍🏫 Instructor Teachings:');
            instructors.forEach(instructor => {
                logToConsole(`- ${instructor.teach()}`);
            });
        })
        .catch(error => {
            logToConsole('❌ Error loading data: ' + error.message);
        });
}

async function loadWithAsyncAwait() {
    clearConsole();
    logToConsole('=== Loading Data with Async/Await ===');
    logToConsole('Attempting to fetch data.json...');
    
    try {
        const data = await safeFetch();
        
        logToConsole('✅ Data loaded successfully!');
        logToConsole('Instructors Data:');
        logToConsole(JSON.stringify(data.instructors, null, 2));
        
        createInstances(data);
        logToConsole('\n🎓 Student Introductions (Async/Await):');
        students.forEach(student => {
            logToConsole(`- ${student.introduce()}`);
        });
        
        logToConsole('\n👨‍🏫 Instructor Teachings (Async/Await):');
        instructors.forEach(instructor => {
            logToConsole(`- ${instructor.teach()}`);
        });
    } catch (error) {
        logToConsole('❌ Error loading data: ' + error.message);
    }
}

function createInstances(data) {
    students = data.students.map(studentData => 
        new Student(studentData.id, studentData.name, studentData.age, studentData.course)
    );
    
    instructors = data.instructors.map(instructorData => 
        new Instructor(instructorData.id, instructorData.name, instructorData.subject, instructorData.teaches)
    );
    
    courses = data.courses;
}

async function displayAllData() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<div class="loading">Loading data...</div>';
    
    try {
        const data = await safeFetch();
        createInstances(data);
        
        let html = '<h2>📊 Student Management System</h2>';
        
        html += '<div class="section"><h3>🎓 Students:</h3>';
        students.forEach(student => {
            const isOlder = student.age > 21;
            const className = isOlder ? 'student-item older-student' : 'student-item';
            const ageIndicator = isOlder ? ' *' : '';
            html += `<div class="${className}">
                ${student.name} (${student.age}${ageIndicator}) - ${student.course}
            </div>`;
        });
        html += '</div>';
        
        html += '<div class="section"><h3>📚 Courses:</h3>';
        courses.forEach(course => {
            html += `<div class="course-item">
                <strong>${course.title}:</strong> ${course.description}
            </div>`;
        });
        html += '</div>';
        
        html += '<div class="section"><h3>👨‍🏫 Instructors:</h3>';
        instructors.forEach(instructor => {
            html += `<div class="instructor-item">
                ${instructor.name} - ${instructor.subject}
            </div>`;
        });
        html += '</div>';
        
        outputDiv.innerHTML = html;
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error">Error loading data: ${error.message}</div>`;
    }
}

async function showRelationships() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<div class="loading">Loading relationships...</div>';
    
    try {
        const data = await safeFetch();
        createInstances(data);
        
        let html = '<h2>🔗 Data Relationships</h2>';
        
        html += '<div class="section"><h3>🎓 Students → Courses → Descriptions:</h3>';
        students.forEach(student => {
            const course = courses.find(c => c.title === student.course);
            if (course) {
                html += `<div class="relationship-item">
                    ${student.name} → ${student.course} → ${course.description}
                </div>`;
            }
        });
        html += '</div>';
        
        html += '<div class="section"><h3>📚 Courses → Instructors:</h3>';
        courses.forEach(course => {
            const instructor = instructors.find(i => i.teaches === course.title);
            if (instructor) {
                html += `<div class="relationship-item">
                    ${course.title} → Taught by ${instructor.name}
                </div>`;
            } else {
                html += `<div class="relationship-item">
                    ${course.title} → No instructor assigned
                </div>`;
            }
        });
        html += '</div>';
        
        html += '<div class="section"><h3>🔄 Complete Relationship Chain:</h3>';
        students.forEach(student => {
            const course = courses.find(c => c.title === student.course);
            const instructor = instructors.find(i => i.teaches === student.course);
            
            if (course && instructor) {
                html += `<div class="relationship-item">
                    👨‍🎓 ${student.name} (${student.age}) studies 📚 ${course.title} taught by 👨‍🏫 ${instructor.name}
                </div>`;
            }
        });
        html += '</div>';
        
        outputDiv.innerHTML = html;
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error">Error loading relationships: ${error.message}</div>`;
    }
}

window.addEventListener('load', () => {
    logToConsole('🚀 ES6 Classes & Async JavaScript Demo Ready!');
    logToConsole('Click the buttons above to explore different features.');
    logToConsole('💡 For best experience, serve files via HTTP server');
    logToConsole('='.repeat(50));
});

function demonstrateES6Features() {
    const greet = (name) => `Hello, ${name}!`;
    
    const message = `Welcome to our ${new Date().getFullYear()} Student Management System`;
    
    const { students: studentList, courses: courseList } = { students, courses };
    
    const youngStudents = students.filter(student => student.age < 22);
    const studentNames = students.map(student => student.name);
    const oldestStudent = students.find(student => student.age === Math.max(...students.map(s => s.age)));
    
    console.log('ES6 Features Demo:', {
        greeting: greet('Developer'),
        message,
        youngStudents,
        studentNames,
        oldestStudent
    });
}