import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import Input from '../../shared/Inputs';
import { get, set } from '../../store/Store';

import './styles.scss';

const Feedback = () => {
  const dispatch = useDispatch();
  const feedback = useSelector(get.feedback);
  const name = useSelector(get.name);
  const email = useSelector(get.email);

  const submit = (e) => {
    if (!feedback.trim()) {
      alert('Please enter Feedback before submitting.');
      return;
    } if (!name.trim()) {
      alert('Please enter Name before submitting.');
      return;
    } if (!email.trim()) {
      alert('Please enter Email before submitting.');
      return;
    }

    e.target.disabled = true;

    const requestPayload = {
      repository: 'dst-feedback',
      title: 'Feedback',
      name,
      email,
      comments: feedback,
      labels: ['dst-econ'],
    };

    fetch('https://feedback.covercrop-data.org/v1/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.data.status === 'success') {
          e.target.disabled = false;
          alert(`
            Thank you for the feedback!
            We will contact you if we have any updates or questions.
          `);
        } else {
          alert('Failed to send Feedback to Github.');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Failed to send Feedback to Github.');
      });
  }; // submit

  return (
    <div id="Feedback">
      <h2>Cover Crop Economic DST Feedback</h2>

      <p>
        Please provide any comments or suggestions that will help us improve the tool.
        <br />
        Include any difficulties you may have encountered while running the program.
      </p>

      {/* <p>
        Note that your inputs will be sent to us along with your feedback, in order to help us troubleshoot.
        Please delete any personal information that you do not wish to share with us.
      </p> */}

      <div
        className="feedback"
        contentEditable
        placeholder="Enter comments here"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: feedback }}
        onBlur={(e) => dispatch(set.feedback(e.currentTarget.innerText.replace(/[\n\r]/g, '<br>')))}
      />

      <div>
        <p>Name</p>
        <Input id="name" />

        <p>Email</p>
        <Input type="email" id="email" />

        <br />
        <div>
          <Button
            variant="contained"
            onClick={(e) => submit(e)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}; // Feedback

Feedback.menu = (
  <span>
    Feed
    <u>b</u>
    ack
  </span>
);

export default Feedback;
