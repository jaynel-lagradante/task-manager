import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';
import TaskListComponent from './components/TaskListComponent';
import TaskComponent from './components/TaskComponent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ViewTaskComponent from './components/ViewTaskComponent';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/" element={<TaskListComponent />} />
                    <Route path="/create-task" element={<TaskComponent />} />
                    <Route path="/edit-task/:id" element={<TaskComponent />} />
                    <Route path="/view-task/:id" element={<ViewTaskComponent />} />
                </Routes>
            </Router>
        </LocalizationProvider>
    );
}

export default App;
