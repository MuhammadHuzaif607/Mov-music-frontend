import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function Releases() {
  const [releases, setReleases] = useState([]); // Releases data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  }); // Pagination data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(10); // Page size
  const [search, setSearch] = useState(''); // Search term
  const [status, setStatus] = useState(''); // Status filter
  const [language, setLanguage] = useState(''); // Language filter
  const [kind, setKind] = useState(''); // Kind filter
  const [genre, setGenre] = useState(''); // Genre filter
  const [subgenre, setSubgenre] = useState(''); // Subgenre filter
  const [label, setLabel] = useState(''); // Label filter
  const [publisher, setPublisher] = useState(''); // Publisher filter
  const [copyrightHolder, setCopyrightHolder] = useState(''); // Copyright holder filter
  const [catalogueNumber, setCatalogueNumber] = useState(''); // Catalogue number filter
  const [ordering, setOrdering] = useState(''); // Ordering field

  const accessToken = localStorage.getItem('accessToken');

  // Fetch releases data
  const fetchReleases = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/releases/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          search,
          status,
          language,
          kind,
          genre,
          subgenre,
          label,
          publisher,
          copyright_holder: copyrightHolder,
          catalogue_number: catalogueNumber,
          ordering,
          page,
          page_size: pageSize,
        },
      });
      setReleases(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch releases.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch releases on component mount or when filters change
  useEffect(() => {
    fetchReleases(currentPage);
  }, [
    search,
    status,
    language,
    kind,
    genre,
    subgenre,
    label,
    publisher,
    copyrightHolder,
    catalogueNumber,
    ordering,
    pageSize,
    currentPage,
  ]);

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Releases
      </Typography>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Filters */}
      {/* <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
            <MenuItem value="takedown_request">Takedown Request</MenuItem>
            <MenuItem value="taken_down">Taken Down</MenuItem>
            <MenuItem value="re_delivery-editing">
              Re-Delivery (Editing)
            </MenuItem>
            <MenuItem value="re_delivery-delivery">
              Re-Delivery (Delivery)
            </MenuItem>
            <MenuItem value="ready">Ready</MenuItem>
            <MenuItem value="approval">Approval</MenuItem>
            <MenuItem value="locked">Locked</MenuItem>
            <MenuItem value="delivering">Delivering</MenuItem>
            <MenuItem value="unlocked">Unlocked</MenuItem>
            <MenuItem value="distributed">Distributed</MenuItem>
            <MenuItem value="live">Live</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            label="Language"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="EN">English</MenuItem>
            <MenuItem value="ES">Spanish</MenuItem>
            <MenuItem value="FR">French</MenuItem>
           
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Kind</InputLabel>
          <Select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            label="Kind"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="EP">EP</MenuItem>
            <MenuItem value="album">Album</MenuItem>
            <MenuItem value="compilation">Compilation</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Subgenre"
          value={subgenre}
          onChange={(e) => setSubgenre(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Copyright Holder"
          value={copyrightHolder}
          onChange={(e) => setCopyrightHolder(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Catalogue Number"
          value={catalogueNumber}
          onChange={(e) => setCatalogueNumber(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Ordering</InputLabel>
          <Select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            label="Ordering"
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="release_date">Release Date</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchReleases(1)}
          style={{ marginTop: '10px' }}
        >
          Apply Filters
        </Button>
      </Paper> */}

      {/* Loading state */}
      {loading && <CircularProgress />}

      {/* Releases Table */}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Subgenre</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Copyright Holder</TableCell>
                <TableCell>Catalogue Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {releases.length > 0 ? (
                releases.map((release) => (
                  <TableRow key={release.id}>
                    <TableCell>{release.id}</TableCell>
                    <TableCell>{release.name}</TableCell>
                    <TableCell>{release.status}</TableCell>
                    <TableCell>{release.language}</TableCell>
                    <TableCell>{release.kind}</TableCell>
                    <TableCell>{release.genre}</TableCell>
                    <TableCell>{release.subgenre}</TableCell>
                    <TableCell>{release.label}</TableCell>
                    <TableCell>{release.publisher}</TableCell>
                    <TableCell>{release.copyright_holder}</TableCell>
                    <TableCell>{release.catalogue_number}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No releases found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={!pagination.previous || currentPage === 1}
        >
          Previous
        </Button>
        <Typography variant="body1" style={{ alignSelf: 'center' }}>
          Page {currentPage} of {Math.ceil(pagination.count / pageSize)}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={!pagination.next}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Releases;
