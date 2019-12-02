import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',

  async handle({ data }) {
    const { registration } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${registration.student.name} <${registration.student.email}>`,
      subject: 'Matrícula',
      template: 'registration',
      context: {
        student: registration.student,
        price: registration.price,
        plan: registration.plan,
        end_date: format(
          parseISO(registration.end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  },
};
