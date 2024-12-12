'use client';
import { useState } from 'react';

import { useQuestionsSelected } from '~/app/admin/contexts';
import FilterDisplay from '~/app/admin/components/filterDisplay';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from '@mui/material';
import QuestionView from '../../components/questionView';
import { Add, NavigateNext, Remove } from '@mui/icons-material';

function AdminChooseQuestions({
    filterDisplayItems,
    questions,
    extraFilterFields,
    onContinue,
}: AdminChooseQuestionsProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { questionsSelected, setQuestionsSelected } = useQuestionsSelected();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelectQuestion = (question: QuestionTypeWithSelection) => {
        if (questionsSelected.some((item) => item.id === question.id)) {
            setQuestionsSelected((prev) => prev.filter((item) => item.id !== question.id));
        } else {
            setQuestionsSelected((prev) => [...prev, question]);
        }
    };

    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className="w-full h-full bg-white">
            <div className="w-full h-[calc(100%-60px)] flex ">
                <div className="w-[20%] h-full flex flex-col items-center px-3 border-r text-sm py-3">
                    <FilterDisplay items={filterDisplayItems} />
                    {extraFilterFields}
                </div>
                <div className="w-[80%] h-full">
                    <Paper
                        style={{ boxShadow: 'none' }}
                        sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
                    >
                        <TableContainer sx={{ height: 'calc(100% - 50px)' }}>
                            <Table
                                stickyHeader
                                aria-label="sticky table"
                                sx={{
                                    '& .MuiTableCell-root': {
                                        padding: '9px',
                                        marginBottom: '2px',
                                    },
                                }}
                            >
                                <TableBody>
                                    {questions
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((question, index) => (
                                            <TableRow key={question.id}>
                                                <TableCell
                                                    width="3%"
                                                    align="center"
                                                    sx={{
                                                        verticalAlign: 'top',
                                                    }}
                                                    className="text-lg font-medium"
                                                >
                                                    {index + 1}.
                                                </TableCell>
                                                <TableCell width="87%">
                                                    <QuestionView data={question} />
                                                </TableCell>
                                                <TableCell
                                                    width="10%"
                                                    align="right"
                                                    sx={{
                                                        verticalAlign: 'top',
                                                    }}
                                                >
                                                    <button
                                                        className={`px-2 py-1 flex justify-center items-center rounded-2xl text-base font-medium min-w-[104px]
                                                        ${
                                                            questionsSelected.some(
                                                                (item) => item.id === question.id,
                                                            )
                                                                ? 'border border-red-500 bg-white text-red-500'
                                                                : 'bg-blue-400 text-white border-0'
                                                        }
                                                     `}
                                                        onClick={() =>
                                                            handleSelectQuestion(question)
                                                        }
                                                    >
                                                        {questionsSelected.some(
                                                            (item) => item.id === question.id,
                                                        ) ? (
                                                            <>
                                                                <Remove />
                                                                <span>Bỏ chọn</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Add />
                                                                <span>Chọn</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            sx={{ height: '50px', borderTop: '1px solid #e0e0e0' }}
                            count={questions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Số hàng mỗi trang:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
                            }
                        />
                    </Paper>
                </div>
            </div>

            <div className="h-[60px] flex justify-between items-center border-t px-3">
                <span className="text-blue-500">Đã chọn {questionsSelected.length} câu hỏi</span>
                <button
                    className="px-3 py-1 flex justify-center items-center rounded bg-green-500 text-base font-medium text-white"
                    onClick={handleContinue}
                >
                    <span>Tiếp tục</span>
                    <NavigateNext />
                </button>
            </div>
        </div>
    );
}

export default AdminChooseQuestions;
