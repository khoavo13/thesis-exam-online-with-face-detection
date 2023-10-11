package dacn.backend.core.common.exception;

public class AnswerOptionNotExistedException extends RuntimeException {
    public AnswerOptionNotExistedException(String answer) {
        super("Answer invalid : " + answer);
    }
}
