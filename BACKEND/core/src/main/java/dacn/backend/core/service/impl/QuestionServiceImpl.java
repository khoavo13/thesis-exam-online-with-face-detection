package dacn.backend.core.service.impl;

import dacn.backend.core.entity.AnswerOption;
import dacn.backend.core.entity.Question;
import dacn.backend.core.entity.QuestionFolder;
import dacn.backend.core.repository.QuestionFolderRepository;
import dacn.backend.core.repository.QuestionRepository;
import dacn.backend.core.service.QuestionService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;

@Service
public class QuestionServiceImpl implements QuestionService {
    private final QuestionFolderRepository questionFolderRepository;
    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionFolderRepository questionFolderRepository, QuestionRepository questionRepository) {
        this.questionFolderRepository = questionFolderRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public QuestionFolder createQuestionFolder(QuestionFolder questionFolder) {
        return questionFolderRepository.save(questionFolder);
    }

    @Override
    public QuestionFolder getQuestionFolderById(Long id) {
        return questionFolderRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Not found question folder with id: " + id));
    }

    @Override
    public QuestionFolder insertQuestions(List<Question> questions, Long questionFolderId) {
        QuestionFolder questionFolder = questionFolderRepository.findById(questionFolderId).orElseThrow(() ->
                new EntityNotFoundException("Not found question folder with id: " + questionFolderId));

        questionFolder.getQuestions().addAll(questions);
        questions.forEach(question -> {
            if (question.getAnswerOptions() != null) {
                question.getAnswerOptions().forEach(answerOption -> answerOption.setQuestion(question));
            }
        });

        questionRepository.saveAll(questions);
        return questionFolderRepository.save(questionFolder);
    }
}
