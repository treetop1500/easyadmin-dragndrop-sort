<?php

namespace Treetop1500\EasyadminDragndropSort\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Class DefaultController
 * @package Treetop1500\EasyadminDragndropSort\Controller
 * @author http://github.com/treetop1500
 */
class DefaultController extends Controller
{
    /**
     * Resorts an item using it's doctrine sortable property
     *
     * @Route("/manage/sort/{entityClass}/{$id}/{$position}",
     *   name="easyadmin_dragndrop_sort",
     *   requirements={
     *     "entityClass"="^([A-Za-z]+)$",
     *     "id"="^(\d)$",
     *     "position"="^(\d)$",
     *   })
     * @param String $entity
     * @param Integer $id
     * @param Integer $position
     * @throws NotFoundHttpException
     * @return Response
     *
     */
    public function sortAction($entityClass, $id, $position)
    {
        $em = $this->getDoctrine()->getManager();
        $e = $em->getRepository($entityClass)->find($id);
        if (is_null($e)) {
            throw new NotFoundHttpException("The entity was not found");
        }
        $e->setPosition($position);
        $em->persist($e);
        $em->flush();
        return $this->redirectToRoute(
            "easyadmin",
            array(
                "action" => "list",
                "entity" => $entityClass,
                "sortField" => "position",
                "sortDirection" => "ASC",
            )
        );
    }
}
