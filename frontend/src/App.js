import { 
  Container,
  Grid,
  Typography,
  Paper,
  OutlinedInput,
  Link,
  LinearProgress,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState, useEffect } from 'react';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_SEARCH_ENDPOINT+'/api/init', {
      method: 'get'
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error();
      }
    })
    .catch((error) => {
      console.error(error)
      setIsError(true)
    })
    .finally(() => {
      setIsLoading(false);
    })
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [data, setData] = useState(null);

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitLoading(true);
    const queryUrl = process.env.REACT_APP_SEARCH_ENDPOINT+'/api/search/'+inputValue
    fetch(queryUrl, {
      method: 'get'
    })
    .then((response) => {
      setIsSubmitLoading(false);
      if(!response.ok) {
        throw new Error();
      }
      if(response.status === 204) {
        return null
      } else {
        return response.json()
      }
    })
    .then((data) => {
      setData(data)
      setIsSubmitted(true)
    })
    .catch((error) => {
      console.error(error)
      setIsError(true)
    })
  }

  function handleBack() {
    setInputValue('')
    setData(null)
    setIsSubmitted(false)
  }

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Paper sx={{
          padding: '2rem 2rem 2.5rem 2rem'
        }} variant='outlined'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5'>{!isSubmitted ? 'Rechercher pour un membre' : 'Résultat'}</Typography>
            </Grid>
            {isError && (
              <Grid item xs={12}>
                <Alert severity="error">Erreur de connexion</Alert>
              </Grid>
            )}
            {isLoading && (
              <Grid my='1rem' item xs={12}>
                <LinearProgress />
              </Grid>
            )}
            {!isLoading && [ !isError && [ !isSubmitted && (
              <React.Fragment key={1}>
                <Grid item xs={12}>
                  <form onSubmit={handleSubmit}>
                    <Grid container>
                      <Grid item xs={12}>
                        <OutlinedInput
                          sx={{
                            mt: '.5rem'
                          }}
                          fullWidth
                          placeholder='Entrez un nom...'
                          id='memberSearch'
                          size='small'
                          onChange={(event) => setInputValue(event.target.value)}
                          value={inputValue}
                          disabled={isSubmitLoading}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton
                          sx={{
                            mt: '1rem'
                          }}
                          variant='contained'
                          size='large'
                          fullWidth
                          disableElevation
                          loading={isSubmitLoading}
                          disabled={!inputValue}
                          type='submit'
                        >
                          Rechercher
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </React.Fragment>
            )]]}
            {isSubmitted && (
              <>
                {!data && (
                  <Grid item xs={12}>
                    <Paper sx={{ py: '1rem' }} disableElevation variant='outlined'>
                      <Typography textAlign='center' variant='h6'>Aucun résultat pour cette recherche</Typography>
                    </Paper>
                  </Grid>
                )}
                {!!data && (
                  <Grid item xs={12}>
                    <TableContainer sx={{ pb: '.5rem' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align='center'>No. Membre</TableCell>
                            <TableCell align='center'>Nom du Membre</TableCell>
                            <TableCell align='center'>Statut</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {data.map((cell, index) => (
                              <TableCell align='center'>{index !== 2 ? cell : cell.trim() === 'Active' ? <Chip label='ACTIF' color='success' /> : <Chip label='INACTIF' color='error' />}</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    fullWidth 
                    onClick={handleBack}
                    variant='contained'
                    disableElevation
                  >
                    Retour
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
        <Typography variant='caption'>
            Propulsé par <Link href='https://msmtech.ca' target="_blank" rel="noopener">MSM Technologies</Link>
        </Typography>
      </Container>
    </React.Fragment>
  );
}

export default App;
