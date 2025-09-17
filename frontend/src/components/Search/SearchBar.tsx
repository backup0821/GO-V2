import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Popper,
  Fade,
  ClickAwayListener,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { setSearchKeyword } from '../../store/slices/searchSlice';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'location';
  count?: number;
}

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { searchHistory } = useSelector((state: RootState) => state.search);

  // 熱門搜尋建議
  const trendingSearches = [
    { id: '1', text: '無障礙廁所', type: 'trending' as const, count: 1250 },
    { id: '2', text: '台北車站', type: 'trending' as const, count: 890 },
    { id: '3', text: '捷運站', type: 'trending' as const, count: 750 },
    { id: '4', text: '公園', type: 'trending' as const, count: 620 },
    { id: '5', text: '醫院', type: 'trending' as const, count: 580 },
  ];

  // 生成搜尋建議
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) {
      // 沒有輸入時顯示歷史記錄和熱門搜尋
      const historySuggestions = searchHistory.slice(0, 5).map((item, index) => ({
        id: `history-${index}`,
        text: item,
        type: 'history' as const,
      }));
      
      return [
        ...historySuggestions,
        ...trendingSearches.slice(0, 3),
      ];
    }

    const queryLower = query.toLowerCase();
    const allSuggestions: SearchSuggestion[] = [];

    // 從歷史記錄中搜尋
    searchHistory.forEach((item, index) => {
      if (item.toLowerCase().includes(queryLower)) {
        allSuggestions.push({
          id: `history-${index}`,
          text: item,
          type: 'history',
        });
      }
    });

    // 從熱門搜尋中搜尋
    trendingSearches.forEach((item) => {
      if (item.text.toLowerCase().includes(queryLower)) {
        allSuggestions.push(item);
      }
    });

    return allSuggestions.slice(0, 8);
  };

  // 處理輸入變化
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setSelectedIndex(-1);
    
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
  };

  // 處理搜尋提交
  const handleSearch = (query?: string) => {
    const searchQuery = query || searchValue.trim();
    
    if (searchQuery) {
      dispatch(setSearchKeyword(searchQuery));
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 處理建議點擊
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  // 處理鍵盤導航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 清除搜尋
  const handleClear = () => {
    setSearchValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 點擊外部關閉建議
  const handleClickAway = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // 取得建議圖示
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return <HistoryIcon fontSize="small" />;
      case 'trending':
        return <TrendingIcon fontSize="small" />;
      case 'location':
        return <LocationIcon fontSize="small" />;
      default:
        return <SearchIcon fontSize="small" />;
    }
  };

  // 取得建議標籤
  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return '歷史';
      case 'trending':
        return '熱門';
      case 'location':
        return '地點';
      default:
        return '';
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={anchorRef} sx={{ width: '100%' }}>
        <TextField
          ref={inputRef}
          fullWidth
          variant="outlined"
          placeholder="搜尋廁所名稱、地址或關鍵字..."
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="清除搜尋"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 3,
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.7)',
                opacity: 1,
              },
            },
          }}
        />

        <Popper
          open={showSuggestions && suggestions.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          style={{ width: anchorRef.current?.offsetWidth }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={8}
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  overflow: 'auto',
                  mt: 1,
                }}
              >
                <List dense>
                  {suggestions.map((suggestion, index) => (
                    <ListItem key={suggestion.id} disablePadding>
                      <ListItemButton
                        selected={index === selectedIndex}
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getSuggestionIcon(suggestion.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion.text}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={getSuggestionLabel(suggestion.type)}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: 18 }}
                              />
                              {suggestion.count && (
                                <Typography variant="caption" color="text.secondary">
                                  {suggestion.count.toLocaleString()} 次搜尋
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
