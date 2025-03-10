import { styled } from '@mui/material/styles';
import { Button, MenuItem } from '@mui/material';

export const FilterButton = styled(Button)(({ theme }) => ({
    textTransform: 'none', 
    fontSize: '16px', 
    fontWeight: 400, 
    color: '#000000', 
    backgroundColor: '#F2F8FD', 
    borderRadius: '8px', 
    padding: '8px 16px', 
    border: '1px solid #E0E0E0'
}));

export const FilterIconImg = styled('img')(({ theme }) => ({
    marginRight: '8px', 
    height: '20px'
}));

export const CuztomizedMenuItem = styled(MenuItem)(({ theme }) => ({
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: '30px'
}));