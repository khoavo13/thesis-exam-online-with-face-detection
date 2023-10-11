package dacn.backend.core.common.exception.handler;

import dacn.backend.core.common.exception.AnswerOptionNotExistedException;
import dacn.backend.core.dto.ResponseModel;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityNotFoundException;

@RestControllerAdvice
@Log4j2
public class ExceptionController {
    @ExceptionHandler({EntityNotFoundException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseModel handleQueryDatabaseNotFound(
            EntityNotFoundException exception) {
        log.error(exception.getMessage());
        return new ResponseModel(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({AnswerOptionNotExistedException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseModel handleAnswerInvalid(
            AnswerOptionNotExistedException exception) {
        log.error(exception.getMessage());
        return new ResponseModel(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({BadCredentialsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseModel handleLoginException(
            BadCredentialsException exception) {
        log.error(exception.getMessage());
        return new ResponseModel(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            AccessDeniedException.class,
    })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseModel handleAccessDeniedException(
            AccessDeniedException exception) {
        log.error(exception.getMessage());
        return new ResponseModel("U doesn't have right : " + exception.getMessage(),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({
            Exception.class,
    })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseModel handleAllException(
            Exception exception) {
        log.error(exception.getMessage());
        return new ResponseModel("Something wrong, contact TienMinh : " + exception.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
