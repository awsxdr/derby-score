import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ScoreboardPage} from './components/ScoreboardPage';
import { HomePage } from './components/HomePage/HomePage';
import { ScoreboardControlPanelPage } from './components/ScoreboardControlPanelPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/games',
        children: [{
            path: ':gameId',
            children: [
                {
                    path: 'scoreboard',
                    element: <ScoreboardPage />
                },
                {
                    path: 'controlPanel',
                    element: <ScoreboardControlPanelPage />
                }
            ]
        }]
    }
])

export const Routes = () => (
    <RouterProvider router={router} />
);