package dacn.backend.core.controller;

import dacn.backend.core.dto.QuestionExamDto;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.entity.Exam;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.StudentAnswer;
import dacn.backend.core.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/exams")
public class ExamController extends BaseController{
    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping("/{id}")
    ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }


    @PostMapping
    ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        return ResponseEntity.ok(examService.createExam(exam));
    }

    @PostMapping("/{examId}/rooms")
    ResponseEntity<Exam> insertRoomsIntoExam(@RequestBody List<Room> rooms, @PathVariable Long examId) {
        return ResponseEntity.ok(examService.insertRoomsIntoExam(rooms, examId));
    }

    @PostMapping("/{examId}/questions")
    ResponseEntity<Exam> insertQuestionsIntoExam(@RequestBody List<QuestionExamDto> questionExams, @PathVariable Long examId) {
        return ResponseEntity.ok(examService.insertQuestionsIntoExam(questionExams, examId));
    }

    @PostMapping("/{examId}/submission")
    ResponseEntity<SubmissionDto> submitResponse(@RequestBody SubmissionDto submission, @PathVariable Long examId) {
        return ResponseEntity.ok(examService.submitResponse(submission, examId));
    }

    @PostMapping("/marking-answer/{answerId}")
    ResponseEntity<StudentAnswer> submitResponse(@PathVariable Long answerId, @RequestBody Double score) {
        return ResponseEntity.ok(examService.markingAnswer(answerId, score));
    }

}
