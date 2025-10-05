import React from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DayData from './pages/DayData';
import ClassData from './pages/ClassData';
import TeacherData from './pages/TeacherData';
import StudentData from './pages/StudentData';
import AiSystem from './pages/AiSystem';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/dayData",
      element: <DayData />,
    },
    {
      path: "/classData",
      element: <ClassData />,
    },
    {
      path: "/teacherData",
      element: <TeacherData />,
    },
    {
      path: "/studentData",
      element: <StudentData />,
    },
    {
      path: "/aiSystem/*",
      element: <AiSystem />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
