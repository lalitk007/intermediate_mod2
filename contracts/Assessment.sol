// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchoolGradingSystem {

    // Event to log the addition of a student
    event StudentAdded(uint256 studentId, string name);
    
    // Event to log the grade assignment
    event GradeAssigned(uint256 studentId, string subject, uint8 grade);

    struct Student {
        uint256 id;
        string name;
        mapping(string => uint8) grades; // Subject to grade mapping
    }

    mapping(uint256 => Student) public students;
    uint256 public nextStudentId = 1;

    // Function to add a new student
    function addStudent(string memory name) public {
        students[nextStudentId].id = nextStudentId;
        students[nextStudentId].name = name;
        emit StudentAdded(nextStudentId, name);
        nextStudentId++;
    }

    // Function to assign a grade to a student for a subject
    function assignGrade(uint256 studentId, string memory subject, uint8 grade) public {
        require(studentId > 0 && studentId < nextStudentId, "Invalid student ID");
        require(grade >= 0 && grade <= 100, "Invalid grade");
        students[studentId].grades[subject] = grade;
        emit GradeAssigned(studentId, subject, grade);
    }

    // Function to get the grade of a student for a subject
    function getGrade(uint256 studentId, string memory subject) public view returns (uint8) {
        require(studentId > 0 && studentId < nextStudentId, "Invalid student ID");
        return students[studentId].grades[subject];
    }

    // Function to get the name of a student
    function getStudentName(uint256 studentId) public view returns (string memory) {
        require(studentId > 0 && studentId < nextStudentId, "Invalid student ID");
        return students[studentId].name;
    }
}
