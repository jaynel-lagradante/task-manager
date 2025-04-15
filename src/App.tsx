import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TaskListPage from './pages/TaskListPage';
import TaskPage from './pages/TaskPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ViewTaskPage from './pages/ViewTaskPage';
import Authentication from './hooks/Authentication';
import { ROUTES } from './constants/Routes';
import NotFound from './pages/NotFound';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Router>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

                    <Route
                        path="/*"
                        element={
                            <Authentication>
                                <Routes>
                                    <Route path={ROUTES.DASHBOARD} element={<TaskListPage />} />
                                    <Route path={ROUTES.CREATE_TASK} element={<TaskPage />} />
                                    <Route path={ROUTES.EDIT_TASK_ID} element={<TaskPage />} />
                                    <Route path={ROUTES.VIEW_TASK_ID} element={<ViewTaskPage />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Authentication>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </LocalizationProvider>
    );
}

export default App;
