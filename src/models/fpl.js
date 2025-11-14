import axios from "axios"

import { API_BASE_URL } from "../constants"
axios.defaults.baseURL = API_BASE_URL
export default class FPL {
  //TODO: Add Gameweek calendars with currentGW, nextGW ,previousGW
  //TODO: Add FDR
}
const headers = {
  "content-type": "application/json",
  // "User-Agent": randomUserAgent,
  // "Access-Control-Allow-Origin": "*"
}
export const fetchAPI = url => {
  const result = axios.get(url, {
    headers: headers
  })
  return result
}

export const fetchMultipleAPI = urls => {
  const urlArr = []
  urls.forEach(url => {
    urlArr.push(
      axios.get(url, {
        headers: headers
      })
    )
  })
  const result = axios.all(urlArr)
  return result
}
