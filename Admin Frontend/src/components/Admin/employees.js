import { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/App.css";

const Employees = ({host}) => {
    const [on, setOn] = useState();
   

    const [Employee, setEmployee] = useState({
        name: '',
        age: '',
        dob: '',
        qualification: '',
        salary: ''
    });
    const addemployee = () => {
        
        return (
            <div className='conatiner col-md-6 offset-md-3 border rounded p-4 mt-2 shadow' style={{background:"linear-gradient(to right, #ff7e5f, #feb47b, #ffefa1)"}}>
                 <div style={{textAlign:'right'}}><button className="border" onClick={()=>setOn('')}><b style={{color:'red'}}>X</b></button></div>
                <h1 className='text-center m-4'>Add Employee</h1>
                <form onSubmit={handleAddSubmit} autoComplete='off'>
                    <div className='mb-4'>
                        <label htmlFor="name" className='form-label'>Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className='form-control'
                            placeholder='Enter employee name'
                            value={Employee.name} required
                            onChange={(e) => setEmployee({ ...Employee, name: e.target.value })}
                        /></div>
                    <div className='mb-4'>
                        <label htmlFor="price" className='form-label'>Age</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            className='form-control'
                            placeholder='Enter Age'
                            value={Employee.age} required
                            onChange={(e) => setEmployee({ ...Employee, age: e.target.value })}
                        /></div>
                    <div className='mb-4'>
                        <label htmlFor="description" className='form-label'>Date of Birth</label>
                        <input
                        type="date"
                            id="description"
                            name="description"
                            className='form-control'
                            value={Employee.dob}
                            onChange={(e) => setEmployee({ ...Employee, dob: e.target.value })}
                        /></div>

                    <div className='mb-4'>
                        <label htmlFor="sku" className='form-label'>Qualification</label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            className='form-control'
                            placeholder='Employee Qualification'
                            value={Employee.qualification} required
                            onChange={(e) => setEmployee({ ...Employee, qualification: e.target.value })}
                        /></div>
                    <div className='mb-4'>
                        <label htmlFor="description" className='form-label'>Salary</label>
                        <textarea
                            id="description"
                            name="description"
                            className='form-control'
                            placeholder='salary'
                            value={Employee.salary}
                            onChange={(e) => setEmployee({ ...Employee, salary: e.target.value })}
                        /></div>
                    <div className='mb-4'><button className="submit form-control btn btn-primary" type="submit">Submit</button>
                        <button onClick={()=>{setOn('')}}  className='form-control btn btn-outline-danger mt-3'>Cancel</button></div>
                </form>
            </div>)
    }
    const handleAddSubmit =async (e) => {
        e.preventDefault();
        await axios.post(`${host}/employees/add`,Employee);

        // onAddProduct({ name, price, sku, description });
        setEmployee({
            name: '',
            age: '',
            dob: '',
            qualification: '',
            salary: ''
        });
    };

    
    const [editEmployee, setEditEmployee] = useState({
        employeeId:'',
        age:'',
        name:'',
        dob:'',
        qualification:'',
        salary:''
    });
    const editemployee = () => {
        // const response = axios.get(`${host}/employees/get/${Id}`);
        // response.then((response) => {
        //     setEditEmployee(response.data);
        //   })
        return (
            <div className='conatiner col-md-6 offset-md-3 border rounded p-4 mt-2 shadow' style={{background:"linear-gradient(to right, #ff7e5f, #feb47b, #ffefa1)"}}>
            <div style={{textAlign:'right'}}><button className="border" onClick={()=>setOn('')}><b style={{color:'red'}}>X</b></button></div>
           <h1 className='text-center m-4'>Edit Employee</h1>
           <form onSubmit={handleEditSubmit} autoComplete='off'>
               <div className='mb-4'>
                   <label htmlFor="name" className='form-label'>Name</label>
                   <input
                       type="text"
                       id="name"
                       name="name"
                       className='form-control'
                       placeholder='Enter employee name'
                       value={editEmployee.name} required
                       onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                   /></div>
               <div className='mb-4'>
                   <label htmlFor="price" className='form-label'>Age</label>
                   <input
                       type="text"
                       id="price"
                       name="price"
                       className='form-control'
                       placeholder='Enter Age'
                       value={editEmployee.age} required
                       onChange={(e) => setEditEmployee({ ...editEmployee, age: e.target.value })}
                   /></div>
               <div className='mb-4'>
                        <label htmlFor="description" className='form-label'>Date of Birth</label>
                        <input
                        type="date"
                            id="description"
                            name="description"
                            className='form-control'
                            value={editEmployee.dob}
                            onChange={(e) => setEditEmployee({ ...editEmployee, dob: e.target.value })}
                        /></div>

               <div className='mb-4'>
                   <label htmlFor="sku" className='form-label'>Qualification</label>
                   <input
                       type="text"
                       id="sku"
                       name="sku"
                       className='form-control'
                       placeholder='Employee Qualification'
                       value={editEmployee.qualification} required
                       onChange={(e) => setEditEmployee({ ...editEmployee, qualification: e.target.value })}
                   /></div>
               <div className='mb-4'>
                   <label htmlFor="description" className='form-label'>Salary</label>
                   <textarea
                       id="description"
                       name="description"
                       className='form-control'
                       placeholder='salary'
                       value={editEmployee.salary}
                       onChange={(e) => setEditEmployee({ ...editEmployee, salary: e.target.value })}
                   /></div>
               <div className='mb-4'><button className="submit form-control btn btn-primary" type="submit">Submit</button>
               <button onClick={()=>{setOn('')}}  className='form-control btn btn-outline-danger mt-3'>Cancel</button></div>
           </form>
       </div>)
    }
    const handleEditSubmit =async (e) => {
         e.preventDefault();
        await axios.put(`${host}/employees/update/${editEmployee.employeeId}`, editEmployee);
        setOn('');
    };


    const [Employees, setEmployees] = useState([])
    useEffect(() => {
        const response= axios.get(`${host}/employees/getall`);
        response.then((response) => {
            setEmployees(response.data);
          })
        // console.log(Employees);

        // fetch("${host}/employees/getall")
        //     .then(res => res.json())
        //     .then((result) => setEmployees(result))
        //     // .then(console.log("result" +Employees))
            
    }, [Employees,on]);


    const deleteEmployee = async (employeeId, name) => {
        if (window.confirm("Delete " + name + " ...?")) {
             await axios.delete(`${host}/employees/delete/${employeeId}`);
        }
    }

    

    return (<div className="employees pt-1">
        <div className="container shadebackground">
            <h1 className="mt-5 mb-3">Employees List</h1>
            <table className="table border shadow text-center">
                <thead>
                    <tr><th>Employee ID</th>
                        <th>Name</th>
                        <th>age</th>
                        <th>Date of Birth</th>
                        <th>Qualification</th>
                        <th>Salary</th>
                        <th colSpan={2}>Action</th>
                    </tr></thead>
                <tbody>
                    {Employees.map((Emp, index) => (
                        <tr>
                            <td key={index.employeeId}>{Emp.employeeId}</td>
                            {/* {console.log("EID:"+Employee.EmployeeId)} */}
                            <td key={index.name}>{Emp.name}</td>
                            <td key={index.age}>{Emp.age}</td>
                            <td key={index.dob}>{Emp.dob}</td>
                            <td key={index.qualification}>{Emp.qualification}</td>
                            <td key={index.salary}>{Emp.salary}</td>
                            <td><button className="btn btn-success mx-3 " onClick={() => {setOn('edit');setEditEmployee(Emp)}}>Edit</button>
                                <button className="btn btn-danger" onClick={() => deleteEmployee(Emp.employeeId, Emp.name)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="me-3" style={{textAlign:'right'}}  ><button className="btn btn-secondary" onClick={() => setOn('add')}>Add an employee</button></div>
        </div>
        <div>
            {(on === 'add' ? addemployee() : (on === 'edit' ? editemployee() : ''))}
        </div></div>
    )
}
export default Employees;