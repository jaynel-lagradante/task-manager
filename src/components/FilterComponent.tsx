import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  Popover,
  MenuList,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FilterIcon from './../assets/Icons/Filter.svg';
import { CuztomizedMenuItem, FilterButton, FilterIconImg } from '../layouts/FilterStyles';

interface SubMenuItem {
  label: string;
}

interface MenuItemProps {
  label: string;
  subMenu?: SubMenuItem[];
}

interface FilterComponentProps {
  menuItems: MenuItemProps[];
  buttonLabel: string;
  onSubMenuItemClick?: (mainMenu: string | null, subMenu: string | null) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ menuItems, buttonLabel, onSubMenuItemClick  }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [currentSubMenu, setCurrentSubMenu] = useState<SubMenuItem[] | null>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setCurrentSubMenu(null);
  };

  const handleMenuItemClick = (item: MenuItemProps, event: React.MouseEvent<HTMLElement>) => {
    if (item.subMenu) {
        setCurrentMenu(item.label);
        setCurrentSubMenu(item.subMenu);
        setSubMenuAnchorEl(event.currentTarget);
    } else if (item) {
        handleClose();
    } else {
        handleClose();
    }
  }; 

  const handleSubMenuItemClick = (item: SubMenuItem) => {
    if (item.label) {
        onSubMenuItemClick && onSubMenuItemClick(currentMenu, item.label);
        handleClose();
    } else {
        handleClose();
    }
  };

  const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
        setCurrentSubMenu(null);
  };

  const open = Boolean(anchorEl);
  const subMenuOpen = Boolean(subMenuAnchorEl);

  return (
    <div>
      <FilterButton aria-controls={open ? 'basic-menu' : undefined} 
        aria-haspopup="true" aria-expanded={open ? 'true' : undefined} 
        onClick={handleClick}>
          <FilterIconImg src={FilterIcon} alt="Filter" />
        {buttonLabel}
      </FilterButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems.map((item, index) => (
          <CuztomizedMenuItem
            key={index}
            onClick={(event) => handleMenuItemClick(item, event)}
          >
            {item.label}
            {item.subMenu && <ArrowRightIcon />}
          </CuztomizedMenuItem>
        ))}
      </Menu>

      <Popover
        open={subMenuOpen}
        anchorEl={subMenuAnchorEl}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList>
          {currentSubMenu &&
            currentSubMenu.map((subItem, index) => (
              <MenuItem key={index} onClick={() => handleSubMenuItemClick(subItem)}>
                {subItem.label}
              </MenuItem>
            ))}
        </MenuList>
      </Popover>
    </div>
  );
};

export default FilterComponent;