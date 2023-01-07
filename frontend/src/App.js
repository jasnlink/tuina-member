import { 
  Container,
  Grid,
  Typography,
  Paper,
  OutlinedInput,
  Link,
  LinearProgress
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

  function handleSubmit() {
    setIsSubmitLoading(true);
    const queryUrl = process.env.REACT_APP_SEARCH_ENDPOINT+'/api/search/'+inputValue
    fetch(queryUrl, {
      method: 'get'
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error();
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error(error)
      setIsError(true)
    })
    .finally(() => {
      setIsSubmitLoading(false);
    })
  }

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Paper sx={{
          padding: '2rem 2rem 2.5rem 2rem'
        }} variant='outlined'>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5'>Recherchez pour un membre</Typography>
            </Grid>
            {isError && (
              <Typography>ERROR</Typography>
            )}
            {isLoading && (
              <Grid my='1rem' item xs={12}>
                <LinearProgress />
              </Grid>
            )}
            {!isLoading && [ !isError && (
              <React.Fragment key={1}>
                <Grid item xs={12}>
                  <OutlinedInput
                    sx={{
                      mt: '1rem'
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
                      mt: '.5rem'
                    }}
                    variant='contained'
                    size='large'
                    fullWidth
                    disableElevation
                    loading={isSubmitLoading}
                    onClick={handleSubmit}
                  >
                    Rechercher
                  </LoadingButton>
                </Grid>
              </React.Fragment>
            )]}
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
