import React, { useState } from "react"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import { getComparator, stableSort } from "../../helpers"

import EnhancedTableToolbar from "./enhanced-table-toolbar.component"
import EnhancedTableHead from "./enhanced-table-head.component"
import SimpleModal from "./modal.component"
import ImageAvatars from "./avatar.component"

import useStyles from "./enhanced-table-styles"

import "./members.styles.scss"

export default function EnhancedTable({ members }) {
  const [open, setOpen] = useState(false)
  const [currMember, setCurrMember] = useState({})

  const handleOpen = fields => {
    setOpen(true)
    setCurrMember({ ...fields })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const classes = useStyles()
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("calories")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, members.length - page * rowsPerPage)
  return (
    <>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table">
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={members.length}
          />
          <TableBody>
            {stableSort(members, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member, index) => {
                const isItemSelected = isSelected(member.name)
                const labelId = `enhanced-table-checkbox-${index}`
                const { ...fields } = member
                return (
                  <TableRow
                    hover
                    onClick={event => handleOpen(fields)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={member._id}
                    selected={isItemSelected}
                  >
                    <ImageAvatars fileName={member.fileName} />
                    <TableCell component="th" id={labelId} scope="member" className="table-cell">
                      {member.memberName}
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      {member.instrument1}
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      {member.instrument2}
                    </TableCell>
                    <TableCell align="left" className="table-cell">
                      {member.location}
                    </TableCell>
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={members.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <SimpleModal
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        currMember={currMember}
      />
    </>
  )
}
