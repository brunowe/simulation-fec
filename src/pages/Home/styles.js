/* --------------------------------- IMPORTS ---------------------------------*/
import styled from "styled-components";

/* --------------------------------- EXPORTS ---------------------------------*/

export const Div = styled.div`
  height: 600px;
  width: 50%;
  background-color: #eee;
  border: solid 1px #ddd;
  border-radius: 4px;
  margin: auto;
  padding: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, Helvetica, sans-serif;

  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border: solid 1px #ddd;
    border-radius: 4px;
  }
`;

export const Form = styled.div`
  flex-direction: column !important;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  border: solid 1px #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #e9e9e9;
  input,
  button {
    height: 30px;
    width: 200px;
    border: solid 1px #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  input {
    background-color: #eee;
    margin-bottom: 10px;
  }
  button {
    font-weight: bold;
    background-color: #3ae;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:hover {
      background: #f4d75d;
      text-decoration: none;
    }
    &:focus {
      background: #f4d75d;
    }
  }
`;
