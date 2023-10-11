package dacn.backend.core.controller;

import dacn.backend.core.entity.Exam;
import dacn.backend.core.entity.Question;
import dacn.backend.core.entity.QuestionFolder;
import dacn.backend.core.service.ExamService;
import dacn.backend.core.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/folders")
public class QuestionFolderController extends BaseController{
    private final QuestionService questionService;

    public QuestionFolderController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/{id}")
    ResponseEntity<QuestionFolder> getQuestionFolderById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionFolderById(id));
    }

    @PostMapping("/{questionFolderId}/questions")
    ResponseEntity<QuestionFolder> insertQuestionsIntoQuestionFolder(@RequestBody List<Question> questions,
                                                                     @PathVariable Long questionFolderId) {
        return ResponseEntity.ok(questionService.insertQuestions(questions, questionFolderId));
    }

    @PostMapping
    ResponseEntity<QuestionFolder> createQuestionFolder(@RequestBody QuestionFolder questionFolder) {
        return ResponseEntity.ok(questionService.createQuestionFolder(questionFolder));
    }

}
