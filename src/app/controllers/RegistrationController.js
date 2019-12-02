import * as Yup from 'yup';
import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Queue from '../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({});
    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not exist.' });
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan not exist.' });
    }

    const registrationExists = await Registration.findOne({
      where: { student_id: req.body.student_id },
    });

    if (registrationExists) {
      return res.status(400).json({ error: 'Registration already exists.' });
    }

    const { price, duration } = await Plan.findByPk(plan_id);

    const registration_price = price * duration;

    const start_date = new Date();
    const end_date = addMonths(start_date, duration);

    const { id } = await Registration.create({
      student_id,
      plan_id,
      price: registration_price,
      start_date,
      end_date,
    });

    await Queue.add({
      registration: {
        plan: planExists,
        end_date,
        price: registration_price,
        student: studentExists,
      },
    });

    return res.json({
      id,
      student_id,
      plan_id,
      price: registration_price,
      start_date,
      end_date,
    });
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
