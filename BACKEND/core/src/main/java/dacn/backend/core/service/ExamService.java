package dacn.backend.core.service;

import dacn.backend.core.dto.QuestionExamDto;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.entity.Exam;
import dacn.backend.core.entity.QuestionExam;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.StudentAnswer;

import java.util.List;

public interface ExamService {
    Exam getExamById(Long id);
    Exam createExam(Exam exam);
    Exam insertRoomsIntoExam(List<Room> rooms, Long examId);
    Exam insertQuestionsIntoExam(List<QuestionExamDto> questionIds, Long examId);
    SubmissionDto submitResponse(SubmissionDto submission, Long examId);
    StudentAnswer markingAnswer(Long answerId, Double score);
}
