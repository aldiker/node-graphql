export function capitalize(value) {
    return value.toString().charAt(0).toUpperCase() + value.slice(1)
}

export function date(inputDate = new Date(), withTime = false) {
    const inputDateToDate = new Date(+inputDate)
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    }
    // добавляем поля форматирования если нужно показывать время
    if (withTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
    }

    // Проверяем получили ли мы дату или NAN в случае, если на входе была не дата
    if (!isNaN(inputDateToDate.getTime())) {
        // Это допустимая дата - форматируем
        return new Intl.DateTimeFormat('ru-RU', options).format(inputDateToDate)
    } else {
        // inputDate не является допустимой датой - выводим ошибку
        console.error('Недопустимая дата:', inputDate)
    }
}

export function pluralizeTasks(count) {
    if (count === 1) {
        return 'задача'
    } else if (count >= 2 && count <= 4) {
        return 'задачи'
    } else {
        return 'задач'
    }
}
