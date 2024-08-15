import {useState, useEffect} from "react";
import {ethers} from "ethers";
import gradingSystemABI from "../artifacts/contracts/Assessment.sol/SchoolGradingSystem.json";

 
export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [gradingSystem, setGradingSystem] = useState(undefined);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(0);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState(0);
  const [retrievedGrade, setRetrievedGrade] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const gradingSystemabi = gradingSystemABI.abi;


  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getGradingSystemContract();
  };

  const getGradingSystemContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const gradingSystemContract = new ethers.Contract(contractAddress, gradingSystemabi, signer);

    setGradingSystem(gradingSystemContract);
  };

  const addStudent = async () => {
    if (gradingSystem && studentName) {
      let tx = await gradingSystem.addStudent(studentName);
      await tx.wait();
      alert("Student added successfully");
    }
  };

  const assignGrade = async () => {
    if (gradingSystem && studentId && subject && grade) {
      let tx = await gradingSystem.assignGrade(studentId, subject, grade);
      await tx.wait();
      alert("Grade assigned successfully");
    }
  };

  const getStudentGrade = async () => {
    if (gradingSystem && studentId && subject) {
      let retrievedGrade = await gradingSystem.getGrade(studentId, subject);
      setRetrievedGrade(retrievedGrade);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this system.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <div>
          <h3>Add Student</h3>
          <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student Name" />
          <button onClick={addStudent}>Add Student</button>
        </div>
        <div>
          <h3>Assign Grade</h3>
          <input type="number" value={studentId} onChange={(e) => setStudentId(parseInt(e.target.value))} placeholder="Student ID" />
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <input type="number" value={grade} onChange={(e) => setGrade(parseInt(e.target.value))} placeholder="Grade" />
          <button onClick={assignGrade}>Assign Grade</button>
        </div>
        <div>
          <h3>Get Grade</h3>
          <input type="number" value={studentId} onChange={(e) => setStudentId(parseInt(e.target.value))} placeholder="Student ID" />
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <button onClick={getStudentGrade}>Get Grade</button>
          {retrievedGrade !== undefined && <p>Grade: {retrievedGrade}</p>}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the School Grading System!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}
      </style>
    </main>
  );
}
