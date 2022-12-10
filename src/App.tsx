import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios"
import Skeleton from '@mui/material/Skeleton';

const url = 'https://randomuser.me/api'
const App = () => {
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [{title, first, last}, setName] = useState<{ [key: string]: any }>({});
  const [{email}, setEmail] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      if (typeof window !== "undefined") {
        setLoading(true);
        await axios.get(
          url
        ).then((res) => {
          if (res?.status === 200) {
            setData(res?.data?.results?.[0]);
            setName(res?.data?.results?.[0].name);
            setEmail(res?.data?.results?.[0]);
            //set items to local storage in a format {name: 'some name', email: 'em@email.com'}
            localStorage.setItem("user", JSON.stringify({
              name: `${res?.data?.results?.[0].name?.title}. ${res?.data?.results?.[0].name?.first} ${res?.data?.results?.[0].name?.last}`,
              email: res?.data?.results?.[0]?.email
            }));
            setError('')
            setLoading(false);
          } else {
            //incase backend gives failed response
            setData({});
            setName({});
            setEmail({});
            setLoading(false);
            setError('Something went wrong, Please hit the refresh button again')
          }
        });
      }
    } catch (error) {
      //incase of API failing set all states to empty and show error on UI
      setData({});
      setName({});
      setEmail({});
      setLoading(false);
      setError('Something went wrong, Please hit the refresh button again')
    }
  };

  //get full name method
  const getName = () => {
    if (title) {
      return `${title}. ${first} ${last}`
    }
  }

  return (
    <div className="App">
      {loading &&
      <div className='container'>
        <div>
          <Skeleton
            style={{height: 70, width: 70, borderRadius: 999999, backgroundColor: "#ECEFF3", transform: "none"}}
          />
        </div>
        <div className='nameContainer'>
          <Skeleton
            style={{height: 24, width: '80%', backgroundColor: "#ECEFF3", transform: "none", marginBottom: 5}}
          />
          <Skeleton
            style={{height: 24, width: '80%', backgroundColor: "#ECEFF3", transform: "none"}}
          />
        </div>
      </div>
      }
      {!loading &&
      <div className="container animation">
        <div>
          <img className="image" src={data?.picture?.medium} alt={first}/>
        </div>
        <div className='nameContainer'>
          <p className='name'>{getName()}</p>
          <p className='email'>{email}</p>
          {error && <div className='error'>{error}</div>}
        </div>
      </div>
      }
      <div className='alignCenter'>
        <button disabled={loading} className={`${loading ? 'cursorBlock refreshButtonDisable' : 'refreshButton'}`}
                onClick={() => getData()}>
          {loading && <div className='spinner'></div>}
          {!loading && <div>Refresh</div>}
        </button>
      </div>
    </div>
  );
}

export default App;
