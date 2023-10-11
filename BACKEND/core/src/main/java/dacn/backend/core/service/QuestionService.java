package dacn.backend.core.service;

import dacn.backend.core.entity.Question;
import dacn.backend.core.entity.QuestionFolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

public interface QuestionService {
    QuestionFolder createQuestionFolder(QuestionFolder questionFolder);

    QuestionFolder getQuestionFolderById(Long id);

    QuestionFolder insertQuestions(List<Question> questions, Long questionFolderId);
}
