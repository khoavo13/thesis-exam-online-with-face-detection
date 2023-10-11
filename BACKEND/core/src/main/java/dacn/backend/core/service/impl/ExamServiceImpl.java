package dacn.backend.core.service.impl;

import dacn.backend.core.common.enums.QuestionType;
import dacn.backend.core.common.enums.Role;
import dacn.backend.core.common.exception.AnswerOptionNotExistedException;
import dacn.backend.core.dto.QuestionExamDto;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.entity.*;
import dacn.backend.core.repository.*;
import dacn.backend.core.service.ExamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ExamServiceImpl implements ExamService {
    private final ExamRepository examRepository;
    private final RoomRepository roomRepository;
    private final QuestionRepository questionRepository;
    private final QuestionExamRepository questionExamRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final UsersRepository usersRepository;
    private final SubmissionRepository submissionRepository;

    public ExamServiceImpl(ExamRepository examRepository,
                           RoomRepository roomRepository,
                           QuestionRepository questionRepository,
                           QuestionExamRepository questionExamRepository, StudentAnswerRepository studentAnswerRepository,
                           UsersRepository usersRepository, SubmissionRepository submissionRepository) {
        this.examRepository = examRepository;
        this.roomRepository = roomRepository;
        this.questionRepository = questionRepository;
        this.questionExamRepository = questionExamRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.usersRepository = usersRepository;
        this.submissionRepository = submissionRepository;
    }

    @Override
    public Exam getExamById(Long id) {
        return examRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Not found exam with id: " + id));
    }

    @Override
    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    @Override
    public Exam insertRoomsIntoExam(List<Room> rooms, Long examId) {
        Exam exam = examRepository.findById(examId).orElseThrow(() ->
                new EntityNotFoundException("Not found exam with id: " + examId));
        exam.getRooms().addAll(rooms);
        rooms.forEach(room -> room.setExam(exam));

        roomRepository.saveAll(rooms);
        return examRepository.save(exam);
    }

    @Override
    public Exam insertQuestionsIntoExam(List<QuestionExamDto> questionExams, Long examId) {
        Map<Long, Double> questionScores = new HashMap<>();
        questionExams.forEach(questionExamDto ->
                questionScores.put(questionExamDto.getQuestionId(), questionExamDto.getScore()));
        Exam exam = examRepository.findById(examId).orElseThrow(() ->
                new EntityNotFoundException("Not found exam with id: " + examId));
        List<Question> questionList = questionRepository.findAllById(questionScores.keySet());

        List<QuestionExam> questionExamEntities = questionList.stream().map(question -> {
            QuestionExam entity = new QuestionExam();
            entity.setScore(questionScores.get(question.getId()));
            entity.setExam(exam);
            entity.setContent(question);
            return entity;
        }).collect(Collectors.toList());

        exam.setQuestions(questionExamEntities);
        questionExamRepository.saveAll(questionExamEntities);
        return exam;
    }

    @Override
    public SubmissionDto submitResponse(SubmissionDto submission, Long examId) {
        Users student = usersRepository.findByIdAndRole(submission.getStudentId(), Role.STUDENT).orElseThrow(() ->
                new EntityNotFoundException("Not found user has role student with id: " + submission.getStudentId()));
        Exam exam = examRepository.findById(examId).orElseThrow(() ->
                new EntityNotFoundException("Not found exam with id: " + examId));

        Submission submissionEntity = new Submission();
        submissionEntity.setExam(exam);
        submissionEntity.setStudent(student);

        submission.getContent().forEach(studentAnswer -> {
            QuestionExam question = questionExamRepository.findById(studentAnswer.getQuestion().getId()).orElseThrow(() ->
                new EntityNotFoundException("Not found question folder with id: " + studentAnswer.getQuestion().getId()));

            if (question.getContent().getType() == QuestionType.MULTI_CHOICE_ONE_SELECT) {
                validateAnswerOfMultiChoiceQuestion(question.getContent(), studentAnswer.getContent());
            }

            if (question.getContent().getSolution().getContent().equals(studentAnswer.getContent())) {
                studentAnswer.setScore(question.getScore());
            }

            studentAnswer.setQuestion(question);
            studentAnswer.setSubmission(submissionEntity);
        });
        submissionEntity.setAnswers(submission.getContent());

        submissionRepository.save(submissionEntity);

        return submission;
    }

    @Override
    public StudentAnswer markingAnswer(Long answerId, Double score) {
        StudentAnswer entity = studentAnswerRepository.findById(answerId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Not found answer of student with id: " + answerId));
        entity.setScore(score);
        return studentAnswerRepository.save(entity);
    }

    private void validateAnswerOfMultiChoiceQuestion(Question question, String answer) {
        for (AnswerOption answerOption : question.getAnswerOptions()) {
            if (Objects.equals(answerOption.getContent(), answer)) {
                return;
            }
        }
        throw new AnswerOptionNotExistedException(answer);
    }

}
