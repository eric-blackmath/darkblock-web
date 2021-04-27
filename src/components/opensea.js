  
  function Opensea() {

    const options = {method: 'GET'};

    fetch('https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20', options)
      .then(response => console.log(response))
      .catch(err => console.error(err));
      return (
        <div></div>
    );

  }
  
  export default Opensea;
  