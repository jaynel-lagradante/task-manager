import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TaskListPage from './pages/TaskListPage';
import TaskPage from './pages/TaskPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ViewTaskPage from './pages/ViewTaskPage';
import Authentication from './hooks/Authentication';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/*"
                        element={
                            <Authentication>
                                <Routes>
                                    <Route path="/" element={<TaskListPage />} />
                                    <Route path="/create-task" element={<TaskPage />} />
                                    <Route path="/edit-task/:id" element={<TaskPage />} />
                                    <Route path="/view-task/:id" element={<ViewTaskPage />} />
                                </Routes>
                            </Authentication>
                        }
                    />
                </Routes>
            </Router>
        </LocalizationProvider>
    );
}

export default App;
