const getTokenFromLocalStorage = () => JSON.parse(localStorage.getItem("okta-token-storage"))

const hours12 = date => (date.getHours() + 24) % 12 || 12

const formatDate = date => {
  const convertedDate = new Date(date)
  const dateFormat = convertedDate.toDateString().slice(0, 10)
  const hours = hours12(convertedDate)
  const minutes = convertedDate.getMinutes()
  const amPM = convertedDate.toLocaleTimeString().slice(-2)
  const timeFormat = `${hours}:${minutes} ${amPM}`
  return [dateFormat, timeFormat]
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

module.exports = {
  descendingComparator,
  getComparator,
  getTokenFromLocalStorage,
  formatDate,
  hours12,
  stableSort
}
