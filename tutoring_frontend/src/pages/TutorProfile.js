// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface Teacher {
//   id: number;
//   firstname: string;
//   lastname: string;
//   email: string;
//   phone: string;
//   address: string;
//   description: string;
//   subject: string;
//   price: string;
//   availability: string;
//   ratings: string;
//   tutoring_location: string;
//   username: string;
//   password: string;
//   img_url: string;
// }

// const TeachersList: React.FC = () => {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/teachers')
//       .then(response => {
//         if (response.data.success) {
//           setTeachers(response.data.data.rows);
//         } else {
//           setError('Failed to fetch data');
//         }
//       })
//       .catch((err) => {
//         setError('Error fetching data');
//         console.error(err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h2>Teachers List</h2>
//       <ul>
//         {teachers.map((teacher) => (
//           <li key={teacher.id}>
//             <div>
//               <img src={teacher.img_url} alt={teacher.firstname} width="100" />
//               <h3>{teacher.firstname} {teacher.lastname}</h3>
//               <p>{teacher.subject} - {teacher.description}</p>
//               <p>Email: {teacher.email}</p>
//               <p>Phone: {teacher.phone}</p>
//               <p>Price: ${teacher.price}</p>
//               <p>Availability: {teacher.availability}</p>
//               <p>Ratings: {teacher.ratings}</p>
//               <p>Location: {teacher.tutoring_location}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TeachersList;