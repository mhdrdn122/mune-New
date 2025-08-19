import { useState } from "react";
import {
  FormControl,
  InputAdornment,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from '@mui/icons-material/Search';
import { Form } from "react-bootstrap";


const SearchComponent = ({searchWord, setSearchWord}) => {
  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleChange = (event) => {
    setSearchWord(event.target.value)
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
  };

  const handleClick = () => {
    setSearchWord('')
    setShowClearIcon('none')
  };
  return (
    <FormControl fullWidth className={''} sx={{mb: '20px', mr: '22px', bgcolor: '#FFF'}}>
      <TextField
        size="small"
        variant="outlined"
        value={searchWord}
        onChange={handleChange}
        placeholder={ "Search..."}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              style={{ display: showClearIcon, cursor:'pointer' }}
              onClick={handleClick}
            >
              <ClearIcon />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default SearchComponent;
