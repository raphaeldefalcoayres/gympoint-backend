import * as Yup from 'yup';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({});
    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registrationExists = await Registration.findOne({
      where: { title: req.body.title },
    });

    if (registrationExists) {
      return res.status(400).json({ error: 'Registration already exists.' });
    }

    const {
      id,
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    } = await Registration.create(req.body);
    return res.json({ id, student_id, plan_id, price, start_date, end_date });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      price: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration not exist.' });
    }

    const {
      id,
      student_id,
      plan_id,
      price,
      start_date,
      end_date,
    } = await registration.update(req.body);

    return res.json({ id, student_id, plan_id, price, start_date, end_date });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({
        error: 'This registration not exists.',
      });
    }

    await registration.destroy();

    return res.status(204).send();
  }
}

export default new RegistrationController();
