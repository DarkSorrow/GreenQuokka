import { useState, useRef, forwardRef } from 'react';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import HomeRounded from '@mui/icons-material/HomeRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Person from '@mui/icons-material/Person';
import Apps from '@mui/icons-material/Apps';
import FactCheck from '@mui/icons-material/FactCheck';
import TranslateIcon from '@mui/icons-material/Translate';

interface AtomsProps {
}

const useRovingIndex = (options?: any) => {
  const { initialActiveIndex = 0, vertical = false, handlers = {} } = options || {};
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const targetRefs = useRef<any[]>([]);
  const targets = targetRefs.current;
  const focusNext = () => {
    let newIndex = activeIndex + 1;
    if (newIndex >= targets.length) {
      newIndex = 0;
    }
    targets[newIndex]?.focus();
    setActiveIndex(newIndex);
  };
  const focusPrevious = () => {
    let newIndex = activeIndex - 1;
    if (newIndex < 0) {
      newIndex = targets.length - 1;
    }
    targets[newIndex]?.focus();
    setActiveIndex(newIndex);
  };
  const getTargetProps = (index: any) => ({
    ref: (ref: any) => {
      if (ref) {
        targets[index] = ref;
      }
    },
    tabIndex: activeIndex === index ? 0 : -1,
    onKeyDown: (e: any) => {
      if (Number.isInteger(activeIndex)) {
        if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) {
          focusNext();
        }
        if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) {
          focusPrevious();
        }
        handlers.onKeyDown?.(e, { setActiveIndex });
      }
    },
    onClick: () => {
      setActiveIndex(index);
    },
  });
  return {
    activeIndex,
    setActiveIndex,
    targets,
    getTargetProps,
    focusNext,
    focusPrevious,
  };
};

const LanguageMenu = forwardRef(({ focusNext, focusPrevious, ...props }: any, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { targets, setActiveIndex, getTargetProps } = useRovingIndex({
    initialActiveIndex: null,
    vertical: true,
    handlers: {
      onKeyDown: (event: any, fns: any) => {
        if (event.key.match(/(ArrowDown|ArrowUp|ArrowLeft|ArrowRight)/)) {
          event.preventDefault();
        }
        if (event.key === 'Tab') {
          setAnchorEl(null);
          fns.setActiveIndex(null);
        }
        if (event.key === 'ArrowLeft') {
          setAnchorEl(null);
          focusPrevious();
        }
        if (event.key === 'ArrowRight') {
          setAnchorEl(null);
          focusNext();
        }
      },
    },
  });

  const open = Boolean(anchorEl);
  const id = open ? 'about-popper' : undefined;
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box sx={{flex: 1}} onMouseLeave={() => setAnchorEl(null)}>
        <ListItemButton
          aria-haspopup
          aria-expanded={open ? 'true' : 'false'}
          ref={ref}
          {...props}
          role="menuitem"
          onKeyDown={(event: any) => {
            props.onKeyDown?.(event);
            if (event.key.match(/(ArrowLeft|ArrowRight|Tab)/)) {
              setAnchorEl(null);
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              targets[0]?.focus();
              setActiveIndex(0);
            }
          }}
          onFocus={(event: any) => setAnchorEl(event.currentTarget)}
          onMouseEnter={(event: any) => {
            props.onMouseEnter?.(event);
            setAnchorEl(event.currentTarget);
          }}
          sx={(theme: any) => ({
            ...(open && theme.variants.plainHover.neutral),
          })}
        >
          <ListItemDecorator sx={{ color: 'inherit' }}>
            <TranslateIcon fontSize="sm" />
          </ListItemDecorator>
          <ListItemContent>Inbox</ListItemContent>
          <KeyboardArrowRightIcon />
        </ListItemButton>
        <PopperUnstyled
          id={id}
          open={open}
          anchorEl={anchorEl}
          disablePortal
          keepMounted
        >
          <List
            role="menu"
            aria-label="About"
            variant="outlined"
            sx={{
              my: 2,
              boxShadow: 'md',
              borderRadius: 'sm',
              '--List-radius': '8px',
              '--List-padding': '4px',
              '--List-divider-gap': '4px',
              '--List-decorator-size': '32px',
            }}
          >
            <ListItem role="none">
              <ListItemButton role="menuitem" {...getTargetProps(0)}>
                <ListItemDecorator>
                  <Apps />
                </ListItemDecorator>
                Overview
              </ListItemButton>
            </ListItem>
            <ListItem role="none">
              <ListItemButton role="menuitem" {...getTargetProps(1)}>
                <ListItemDecorator>
                  <Person />
                </ListItemDecorator>
                Administration
              </ListItemButton>
            </ListItem>
            <ListItem role="none">
              <ListItemButton role="menuitem" {...getTargetProps(2)}>
                <ListItemDecorator>
                  <FactCheck />
                </ListItemDecorator>
                Facts
              </ListItemButton>
            </ListItem>
          </List>
        </PopperUnstyled>
      </Box>
    </ClickAwayListener>
  );
});
// <ListItemButton variant="soft" color="primary">
export const AppLangMenu = () => {
  const {
    targets, 
    getTargetProps,
    setActiveIndex,
    focusNext,
    focusPrevious }: any = useRovingIndex();
  return (
    <ListItem role="none">
      <LanguageMenu
        onMouseEnter={() => {
          setActiveIndex(1);
          targets[1].focus();
        }}
        focusNext={focusNext}
        focusPrevious={focusPrevious}
        {...getTargetProps(1)}
      />
    </ListItem>
  );
};
